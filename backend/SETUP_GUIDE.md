# RootCause Backend Setup Guide

This guide will help you set up the backend for the AI-Powered Crop Disease Detection & Yield Prediction Platform.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or cloud MongoDB Atlas)

## Quick Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Copy the `.env.example` file to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

3. **Environment Configuration**
   Update your `.env` file with your configuration:
   ```env
   MONGO_URI=mongodb://localhost:27017/rootcause
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSCODE=admin123
   ```

4. **Start the Server**
   ```bash
   npm run dev  # For development with auto-restart
   # or
   npm start    # For production
   ```

## Database Setup

1. **Local MongoDB** (easiest for development):
   - Install MongoDB Community Edition
   - Start the MongoDB service
   - Use the default connection string: `mongodb://localhost:27017/rootcause`

2. **MongoDB Atlas** (cloud option):
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a cluster
   - Get your connection string and update `MONGO_URI` in `.env`

## Authentication Flow

### Farmer Authentication
1. **Farmer Registration**: User provides name, phone, password, location details
2. **Farmer Login**: User enters phone number and password
3. **Security**: Passwords are hashed using bcrypt

### Admin Authentication
1. **Admin Registration**: User provides admin details and organization info
2. **Admin Login**: User enters email and password
3. **Security**: Passwords are hashed using bcrypt

## Testing the Setup

1. Start the server: `npm run dev`
2. Go to the frontend and try farmer registration/login
3. Register with phone number, password and location details
4. Login using the same phone number and password

## Troubleshooting

- If you see MongoDB connection errors, verify your `MONGO_URI`
- Make sure your `.env` file is not committed to version control
- Ensure phone numbers are unique for each farmer
- Check that passwords are properly hashed (handled automatically)

## Security Best Practices

- Never commit `.env` file to version control
- Use strong JWT secrets
- Use strong passwords
- Validate phone numbers according to your region's format