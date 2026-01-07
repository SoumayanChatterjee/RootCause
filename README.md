# RootCause 🌱

AI-Powered Agricultural Assistant for Crop Disease Detection and Yield Prediction

## Features

- 🔬 **Disease Detection**: Upload crop images to detect diseases using AI/ML
- 💊 **Treatment Recommendations**: Get personalized treatment suggestions
- 📊 **Yield Prediction**: Predict crop yields based on various parameters
- 🌍 **Multilingual Support**: Available in English, Hindi, Bengali, Tamil, Telugu, and Marathi
- 👨‍🌾 **Farmer Dashboard**: Easy-to-use interface for farmers
- 👨‍💼 **Admin Dashboard**: Comprehensive analytics and management tools
- 🔐 **Phone-Based Authentication**: Passwordless login for farmers

## Tech Stack

### Frontend
- React with Vite
- React Router for navigation
- Axios for API calls
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads

### ML Service
- Python with FastAPI
- Machine Learning models for disease detection and yield prediction

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Python 3.8+

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/RootCause.git
cd RootCause
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

4. Install ML Service Dependencies
```bash
cd ml_service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

5. Configure Environment Variables
```bash
# Copy .env.example to .env in backend folder
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

6. Train ML Models (Optional - Pre-trained models not included due to size limitations)
```bash
# Navigate to ml_service directory
cd ml_service

# Train the disease detection model
python train_disease_model.py

# Train the yield prediction model
python train_yield_model.py
```

### Running the Application

1. Start MongoDB
```bash
mongod
```

2. Start Backend Server
```bash
cd backend
npm run dev
```

3. Start Frontend Development Server
```bash
cd frontend
npm run dev
```

4. Start ML Service
```bash
cd ml_service
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

## Environment Variables

See `backend/.env.example` for required environment variables:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `OPENWEATHER_API_KEY`: API key for weather data
- `ML_SERVICE_URL`: URL for ML service

## Project Structure

```
RootCause/
├── backend/           # Express.js backend
│   ├── controllers/   # Route controllers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   └── middleware/    # Custom middleware
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context providers
│   │   └── services/    # API services
└── ml_service/        # Python ML service
    ├── models/        # ML models
    └── main.py        # FastAPI application
```

## Note on ML Models

Due to GitHub's file size limitations, the pre-trained ML models are not included in this repository:
- `disease_model.h5` (trained disease detection model)
- `yield_model.pkl` (trained yield prediction model) 
- `yield_encoders.pkl` (encoding files for yield prediction)

These models must be trained using the training scripts provided:
- `train_disease_model.py`
- `train_yield_model.py`

Or you can download pre-trained models separately if available.

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
