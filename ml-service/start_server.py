import uvicorn
import sys
import os

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("Starting ML Service on http://0.0.0.0:8000")
    print("Loading models, this may take a moment...")
    
    try:
        # Import the app here to ensure it loads properly
        from main import app
        print("ML Service application loaded successfully!")
        
        # Run the server
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=False  # Disable reload for production
        )
    except ImportError as e:
        print(f"Failed to import main module: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1)