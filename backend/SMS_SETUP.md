# SMS Setup Guide

This guide explains how to configure SMS functionality for OTP delivery in the RootCause platform.

## Available SMS Providers

The system supports multiple SMS providers:

1. **MSG91** (Recommended for India)
2. **Twilio** (Global coverage)
3. **Console** (Default for development)

## Configuration Steps

### 1. Environment Variables

Add the following to your `.env` file:

```env
# SMS Provider (options: console, msg91, twilio)
SMS_PROVIDER=msg91

# For MSG91 (Indian SMS service)
MSG91_AUTH_KEY=your_msg91_auth_key
SMS_TEMPLATE_ID=your_sms_template_id

# For Twilio (International SMS service)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### 2. Install Dependencies

#### For MSG91:
```bash
# axios is already included in dependencies
npm install axios
```

#### For Twilio:
```bash
npm install twilio
```

### 3. Provider-Specific Setup

#### MSG91 Setup:
1. Sign up at [MSG91](https://msg91.com/)
2. Get your Auth Key from the dashboard
3. Create an OTP template or use the default one
4. Update your `.env` file with the credentials

#### Twilio Setup:
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token
3. Purchase a phone number or use the trial number
4. Update your `.env` file with the credentials

### 4. Testing

To test SMS functionality:

1. Set `SMS_PROVIDER` to your chosen provider
2. Add valid credentials to your `.env` file
3. Restart the server
4. Trigger an OTP request through the farmer signup/login flow

### 5. Default Behavior

By default, the system uses `console` provider which logs SMS messages to the console. This is safe for development but won't send actual SMS.

## Troubleshooting

- If you see "Twilio package not found" error, run `npm install twilio`
- Make sure your phone number is in international format (+91XXXXXXXXXX for India)
- Verify your SMS provider credentials in the `.env` file
- Check that your SMS provider supports sending to your target country/region

## Security Note

Never commit your `.env` file with actual credentials to version control. Add it to your `.gitignore` file.