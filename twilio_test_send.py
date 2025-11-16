import json
import sys

# Target and message
TARGET_NUMBER = '+919995891041'
MESSAGE = 'DISASTER ALERT — test message from automated test'

# Hardcoded Twilio credentials
TWILIO_ACCOUNT_SID = "ACdd607017be81fb043b747e10d2e710e6"
TWILIO_AUTH_TOKEN = "fe95af99f5f1ddc4844e7abaea0e4bbd"
TWILIO_MESSAGING_SERVICE_SID = "MG8c1d69bd6a81b4d43473d9ab5e13fa23"
TWILIO_FROM_NUMBER = "+17752567384"

# Check credentials
if not (TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN):
    print(json.dumps({'success': False, 'error': 'twilio_credentials_missing'}))
    sys.exit(2)

try:
    from twilio.rest import Client
    from twilio.base.exceptions import TwilioRestException
except Exception as e:
    print(json.dumps({'success': False, 'error': 'twilio_not_installed', 'details': str(e)}))
    sys.exit(3)

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Determine sender
sender = None
sender_type = None

# Prefer hardcoded messaging service first
if TWILIO_MESSAGING_SERVICE_SID:
    sender = TWILIO_MESSAGING_SERVICE_SID
    sender_type = 'messaging_service_sid'
elif TWILIO_FROM_NUMBER:
    sender = TWILIO_FROM_NUMBER
    sender_type = 'from_number'

if not sender:
    print(json.dumps({
        'success': False, 
        'error': 'no_sender_available', 
        'details': 'No messaging service or from number available.'
    }))
    sys.exit(4)

# Send the message
try:
    if sender_type == 'messaging_service_sid':
        msg = client.messages.create(
            body=MESSAGE,
            to=TARGET_NUMBER,
            messaging_service_sid=sender
        )
    else:
        msg = client.messages.create(
            body=MESSAGE,
            to=TARGET_NUMBER,
            from_=sender
        )

    out = {
        'success': True,
        'provider': 'twilio',
        'sid': getattr(msg, 'sid', None),
        'status': getattr(msg, 'status', None),
        'used_sender': {'type': sender_type, 'value': sender}
    }
    print(json.dumps(out))
    sys.exit(0)

except TwilioRestException as tre:
    print(json.dumps({
        'success': False,
        'error': 'twilio_api_error',
        'details': getattr(tre, 'msg', str(tre)),
        'code': getattr(tre, 'code', None)
    }))
    sys.exit(5)
except Exception as e:
    print(json.dumps({
        'success': False,
        'error': 'twilio_exception',
        'details': str(e)
    }))
    sys.exit(6)
