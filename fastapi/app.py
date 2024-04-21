from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import HTMLResponse
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    #allow_origins=origins,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = tf.keras.models.load_model("../models/pdds.h5")

Potato_class_names = ["Early Blight", "Healthy", "Late Blight"]

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    #image = np.array(Image.open(BytesIO(data)))
    #return image
    try:
        # Open the image using PIL
        img = Image.open(BytesIO(data))
        # Resize the image to the desired size
        resized_img = img.resize((256, 256))
        # Convert the resized image to a NumPy array
        img_array = np.array(resized_img)
        return img_array
    except Exception as e:
        print("Error:", e)
        return None


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    
    predictions = MODEL.predict(img_batch)

    predicted_class = Potato_class_names[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    return {
        'class': predicted_class,
        'accuracy': float(confidence)
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)