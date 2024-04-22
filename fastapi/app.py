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

Potato_class_names = ["Early Blight", "Healthy", "Late Blight"]

@app.get("/")
async def ping():
    return "Prediction server is live..."

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    
    #load models
    #model to check if uploaded image is a leaf
    leaf_detection_model = tf.keras.models.load_model("../models/leaf_and_non-leaf_object_detection_model.h5")
    
    #model to predict the status of the leaf
    prediction_model = tf.keras.models.load_model("../models/pdds.h5")
    
    #upload image to object detection model to check if it's an image '0' for YES and '1' for NO
    leaf_object_check = leaf_detection_model.predict(img_batch)
    
    #compare results and conduct prediction if true
    if(np.argmax(leaf_object_check[0]) == 0):
        print('it is a leaf')
        predictions = prediction_model.predict(img_batch)
        predicted_class = Potato_class_names[np.argmax(predictions[0])]
        confidence = np.max(predictions[0])
        return {
            'class': predicted_class,
            'accuracy': float(confidence)
        }
    else:
        print('it is not a leaf')
        return {
            'class': '0',
            'accuracy': 0.0
        }    
        

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)