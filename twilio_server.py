from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# =========================
# Twilio configuration
# =========================
TWILIO_ACCOUNT_SID = "ACdd607017be81fb043b747e10d2e710e6"
TWILIO_AUTH_TOKEN = "fe95af99f5f1ddc4844e7abaea0e4bbd"
TWILIO_MESSAGING_SERVICE_SID = "MG8c1d69bd6a81b4d43473d9ab5e13fa23"
TWILIO_FROM_NUMBER = "+17752567384" # fallback if Messaging Service not used

# =========================
# Send SMS endpoint
# =========================
@app.route('/send-sms', methods=['POST'])
def send_sms():
    try:
        data = request.json or {}
        phone_number = data.get('phoneNumber')
        message = data.get('message')

        if not phone_number or not message:
            return jsonify({'success': False, 'error': 'missing_phone_or_message'}), 400

        # Import Twilio client
        try:
            from twilio.rest import Client
            from twilio.base.exceptions import TwilioRestException
        except Exception as e:
            return jsonify({'success': False, 'error': 'twilio_not_installed', 'details': str(e)}), 500

        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

        send_kwargs = {}
        if TWILIO_MESSAGING_SERVICE_SID:
            send_kwargs['messaging_service_sid'] = TWILIO_MESSAGING_SERVICE_SID
        elif TWILIO_FROM_NUMBER:
            send_kwargs['from_'] = TWILIO_FROM_NUMBER
        else:
            return jsonify({'success': False, 'error': 'twilio_no_sender_configured'}), 500

        try:
            msg = client.messages.create(body=message, to=phone_number, **send_kwargs)
            return jsonify({
                'success': True,
                'provider': 'twilio',
                'sid': getattr(msg, 'sid', None),
                'status': getattr(msg, 'status', None)
            }), 200
        except TwilioRestException as tre:
            return jsonify({
                'success': False,
                'error': 'twilio_api_error',
                'details': getattr(tre, 'msg', str(tre)),
                'code': getattr(tre, 'code', None)
            }), 502
        except Exception as e:
            return jsonify({'success': False, 'error': 'twilio_exception', 'details': str(e)}), 502

    except Exception as outer:
        return jsonify({'success': False, 'error': 'server_exception', 'details': str(outer)}), 500

# =========================
# Make Call endpoint
# =========================
@app.route('/make-call', methods=['POST'])
def make_call():
    try:
        data = request.json or {}
        phone_number = data.get('phoneNumber')
        message = data.get('message')
        location = data.get('location')
        place = data.get('place')
        distance = data.get('distance')

        if not phone_number:
            return jsonify({'success': False, 'error': 'missing_phone_number'}), 400

        try:
            from twilio.rest import Client
            from twilio.base.exceptions import TwilioRestException
            from twilio.twiml.voice_response import VoiceResponse
        except Exception as e:
            return jsonify({'success': False, 'error': 'twilio_not_installed', 'details': str(e)}), 500

        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

        # Determine the from_number for the call
        from_number = TWILIO_FROM_NUMBER
        if not from_number:
            try:
                numbers = client.incoming_phone_numbers.list(limit=1)
                if numbers:
                    from_number = numbers[0].phone_number
            except:
                pass

        if not from_number:
            return jsonify({'success': False, 'error': 'no_from_number_configured'}), 500

        try:
            # Build the text that will be spoken
            speak_parts = []
            if message:
                speak_parts.append(str(message))
            if place:
                speak_parts.append(f'Location: {place}.')
            if location and isinstance(location, dict):
                lx = location.get('x')
                lz = location.get('z')
                if lx is not None and lz is not None:
                    speak_parts.append(f'Coordinates: x {lx}, z {lz}.')
            if distance is not None:
                try:
                    dist_val = float(distance)
                    dist_text = f'{int(dist_val)}' if dist_val.is_integer() else f'{dist_val:.1f}'
                    speak_parts.append(f'The nearest bunker is approximately {dist_text} units away.')
                except Exception:
                    speak_parts.append(str(distance))
            if not speak_parts:
                speak_parts = ['Attention. This is an emergency alert. Please check your local advisories and seek shelter immediately.']

            speak_text = ' '.join(speak_parts)

            response = VoiceResponse()
            response.say(speak_text, voice='man', language='en-US')
            response.hangup()

            call = client.calls.create(
                to=phone_number,
                from_=from_number,
                twiml=str(response)
            )

            return jsonify({
                'success': True,
                'provider': 'twilio',
                'call_sid': getattr(call, 'sid', None),
                'status': getattr(call, 'status', None),
                'spoken_text': speak_text
            }), 200

        except TwilioRestException as tre:
            return jsonify({
                'success': False,
                'error': 'twilio_api_error',
                'details': getattr(tre, 'msg', str(tre)),
                'code': getattr(tre, 'code', None)
            }), 502
        except Exception as e:
            return jsonify({'success': False, 'error': 'twilio_exception', 'details': str(e)}), 502

    except Exception as outer:
        return jsonify({'success': False, 'error': 'server_exception', 'details': str(outer)}), 500

# =========================
# Index route
# =========================
@app.route('/')
def index():
    return 'Twilio-only SMS server. POST JSON {phoneNumber, message} to /send-sms', 200

# =========================
# Main
# =========================
if __name__ == '__main__':
    print('\n' + '='*60)
    print('Twilio-only SMS server starting')
    print('Twilio configured:', bool(TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN))
    print('Using Messaging Service SID:', bool(TWILIO_MESSAGING_SERVICE_SID))
    print('Using From Number:', bool(TWILIO_FROM_NUMBER))
    print('='*60 + '\n')
    app.run(debug=True, port=5001)
