from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import requests
from ml_model import rainfall_predictor

app = Flask(__name__, static_folder='.', template_folder='.')
CORS(app)

# =========================
# Configuration
# =========================
OPENWEATHER_API_KEY = 'e15ee20095f1ca448fd5782b1d106790' # From original globe.html
TWILIO_ACCOUNT_SID = "ACdd607017be81fb043b747e10d2e710e6"
TWILIO_AUTH_TOKEN = "fe95af99f5f1ddc4844e7abaea0e4bbd"
TWILIO_MESSAGING_SERVICE_SID = "MG8c1d69bd6a81b4d43473d9ab5e13fa23"
TWILIO_FROM_NUMBER = "+17752567384"

# =========================
# Routes for HTML files
# =========================
@app.route('/')
def home():
    return send_from_directory('.', '2.html')

@app.route('/<path:path>')
def serve_html(path):
    return send_from_directory('.', path)

# =========================
# Weather Proxy API
# =========================
@app.route('/api/weather')
def get_weather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    city = request.args.get('city')
    
    if city:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={OPENWEATHER_API_KEY}"
    elif lat and lon:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={OPENWEATHER_API_KEY}"
    else:
        return jsonify({'error': 'Missing location parameters'}), 400
        
    try:
        response = requests.get(url)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# =========================
# ML Prediction API
# =========================
@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json or {}
    temp = float(data.get('temp', 25))
    humidity = float(data.get('humidity', 60))
    pressure = float(data.get('pressure', 1000))
    
    risk_score = rainfall_predictor.predict(humidity=humidity, temp=temp, pressure=pressure)
    
    # Logic to match frontend expectations
    risk_level = "LOW"
    if risk_score > 80: risk_level = "CRITICAL"
    elif risk_score > 60: risk_level = "HIGH"
    elif risk_score > 30: risk_level = "MODERATE"
    
    return jsonify({
        'risk_score': risk_score,
        'risk_level': risk_level,
        'probability': f"{int(risk_score)}%",
        'will_occur': "Yes" if risk_score > 70 else "No"
    })

# =========================
# Twilio Alerting APIs
# =========================
@app.route('/api/alert/sms', methods=['POST'])
def send_sms():
    # ... logic from twilio_server.py ...
    data = request.json or {}
    phone_number = data.get('phoneNumber')
    message = data.get('message')
    
    if not phone_number or not message:
        return jsonify({'success': False, 'error': 'missing_data'}), 400

    from twilio.rest import Client
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    
    try:
        msg = client.messages.create(
            body=message, 
            to=phone_number, 
            messaging_service_sid=TWILIO_MESSAGING_SERVICE_SID if TWILIO_MESSAGING_SERVICE_SID else None,
            from_=TWILIO_FROM_NUMBER if not TWILIO_MESSAGING_SERVICE_SID else None
        )
        return jsonify({'success': True, 'sid': msg.sid})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/alert/call', methods=['POST'])
def make_call():
    # ... logic from twilio_server.py ...
    data = request.json or {}
    phone_number = data.get('phoneNumber')
    message = data.get('message')
    
    if not phone_number or not message:
        return jsonify({'success': False, 'error': 'missing_data'}), 400

    from twilio.rest import Client
    from twilio.twiml.voice_response import VoiceResponse
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    
    try:
        response = VoiceResponse()
        response.say(message, voice='man', language='en-US')
        response.hangup()
        
        call = client.calls.create(
            to=phone_number,
            from_=TWILIO_FROM_NUMBER,
            twiml=str(response)
        )
        return jsonify({'success': True, 'sid': call.sid})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
