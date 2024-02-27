from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
# from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

# origins = [
#     "http://localhost",
#     "http://localhost:3000",
# ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


templates = Jinja2Templates(directory="templates")

MODEL = tf.keras.models.load_model("../models/pdds.h5")

Potato_class_names = ["Early Blight", "Healthy", "Late Blight"]

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("upload.html", {"request": request})

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    
    predictions = MODEL.predict(img_batch)

    predicted_class = Potato_class_names[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)