from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import joblib

# -----------------------------
# FASTAPI APP SETUP
# -----------------------------
app = FastAPI(title="RootCause ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# LOAD DISEASE DETECTION MODEL
# -----------------------------
try:
    disease_model = tf.keras.models.load_model("disease_model.h5")
except Exception as e:
    raise RuntimeError(f"Failed to load disease model: {e}")

# ⚠️ Order MUST match training folder order
disease_classes = ["Healthy", "Leaf_Blight", "Rust"]

# -----------------------------
# LOAD YIELD PREDICTION MODEL
# -----------------------------
try:
    yield_model = joblib.load("yield_model.pkl")
    yield_encoders = joblib.load("yield_encoders.pkl")
except Exception as e:
    raise RuntimeError(f"Failed to load yield model or encoders: {e}")

# -----------------------------
# ROOT ENDPOINT
# -----------------------------
@app.get("/")
def root():
    return {
        "message": "RootCause ML Service Running",
        "services": ["Disease Detection", "Yield Prediction"]
    }

# -----------------------------
# DISEASE PREDICTION ENDPOINT
# -----------------------------
@app.post("/predict-disease")
async def predict_disease(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = image.resize((224, 224))

        img_array = np.array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        predictions = disease_model.predict(img_array)
        index = int(np.argmax(predictions))
        confidence = float(np.max(predictions))

        return {
            "disease": disease_classes[index],
            "confidence": round(confidence, 4)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Disease prediction failed: {str(e)}"
        )

# -----------------------------
# YIELD PREDICTION ENDPOINT
# -----------------------------
@app.post("/predict-yield")
async def predict_yield(data: dict):
    """
    Expected JSON:
    {
        "Crop": "Rice",
        "District": "India",
        "Year": 2022
    }
    """

    try:
        # Validate input
        required_fields = ["Crop", "District", "Year"]
        for field in required_fields:
            if field not in data:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing required field: {field}"
                )

        # Get values
        crop = data["Crop"]
        district = data["District"]
        year = int(data["Year"])

        # Check if crop and district are in the encoder's known categories
        try:
            crop_encoded = yield_encoders["Crop"].transform([crop])[0]
        except ValueError:
            # If crop is not in the known categories, use a default crop that is known to exist
            available_crops = yield_encoders["Crop"].classes_
            # Use Rice, paddy as default since it's a common crop in the model
            if "Rice, paddy" in available_crops:
                closest_crop = "Rice, paddy"
            else:
                closest_crop = available_crops[0]  # Use first available crop as fallback
            crop_encoded = yield_encoders["Crop"].transform([closest_crop])[0]
            print(f"Warning: Crop '{crop}' not found in model. Using '{closest_crop}' instead.")

        try:
            district_encoded = yield_encoders["District"].transform([district])[0]
        except ValueError:
            # If district is not in the known categories, use a default district that is known to exist
            available_districts = yield_encoders["District"].classes_
            # Use India as default since it's a common agricultural country in the model
            if "India" in available_districts:
                closest_district = "India"
            else:
                closest_district = available_districts[0]  # Use first available district as fallback
            district_encoded = yield_encoders["District"].transform([closest_district])[0]
            print(f"Warning: District '{district}' not found in model. Using '{closest_district}' instead.")

        # Prepare feature vector
        features = [[crop_encoded, district_encoded, year]]

        # Predict yield
        prediction = yield_model.predict(features)[0]

        return {
            "predicted_yield": round(float(prediction), 2),
            "unit": "hg/ha (FAO standard)",
            "input": {"Crop": crop, "District": district, "Year": year}
        }

    except ValueError as ve:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid input value: {str(ve)}"
        )

    except KeyError as ke:
        raise HTTPException(
            status_code=500,
            detail=f"Missing encoder for: {str(ke)}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Yield prediction failed: {str(e)}"
        )