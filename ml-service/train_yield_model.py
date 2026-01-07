import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
import joblib

# Load FAO-style dataset
df = pd.read_csv("data/crop_yield.csv")

# Keep only Yield rows
df = df[df["Element"] == "Yield"]

# Select relevant columns
df = df[["Area", "Item", "Year", "Value"]]

# Rename for clarity
df.rename(columns={
    "Area": "District",
    "Item": "Crop",
    "Value": "Yield"
}, inplace=True)

# Encode categorical columns
encoders = {}
for col in ["Crop", "District"]:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# Features and target
X = df[["Crop", "District", "Year"]]
y = df["Yield"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestRegressor(
    n_estimators=150,
    random_state=42
)
model.fit(X_train, y_train)

# Evaluate
preds = model.predict(X_test)
print("R2 Score:", r2_score(y_test, preds))

# Save model and encoders
joblib.dump(model, "yield_model.pkl")
joblib.dump(encoders, "yield_encoders.pkl")

print("✅ Yield model trained and saved successfully")
