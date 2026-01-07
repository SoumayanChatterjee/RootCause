# RootCause Backend

Backend server for the AI-Powered Crop Disease Detection & Yield Prediction Platform.

## Features

- Farmer authentication with phone number + password
- Admin authentication with email + password
- Integration with ML service for disease detection and yield prediction
- Role-based access control (Farmer/Admin)
- Multilingual support
- Secure JWT-based authentication

## Tech Stack

- Node.js
- Express.js
- MongoDB/Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root of the backend directory with the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/rootcause
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSCODE=admin123
   ```

3. **Start the server:**
   ```bash
   npm run dev  # Development mode with auto-restart
   # or
   npm start    # Production mode
   ```

## API Endpoints

### Farmer Authentication
- `POST /api/farmer/signup` - Farmer registration with phone and password
- `POST /api/farmer/login` - Farmer login with phone and password

### Admin Authentication
- `POST /api/admin/signup` - Admin registration
- `POST /api/admin/login` - Admin login

### Protected Routes
- `GET /api/protected/test` - Example protected route

## Database Models

- **Farmer**: name, phone, password, city, district, village, language, role
- **Admin**: name, email, organisationName, password, state, role

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- Role-based access control