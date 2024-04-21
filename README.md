# Plant Disease Detection System
This project aims to assist farmers in detecting diseases in their crops using machine learning techniques. By leveraging image data of crops, the system can predict whether a crop is diseased or not, enabling early intervention and efficient agricultural management.
<ol>
  <li><b>Website link:</b> <a href="https://plant-disease-detection-system.vercel.app/">plant-disease-detection-system.paul_ndalila</a></li>
  <li><b>Android app download link:</b> <a href="https://expo.dev/artifacts/eas/3Xg7AfN6pm1VgXu6jG2aGX.apk">Plant disease detection app</a></li>
</ol>

#  Features
<ul>
  <li><b>Machine Learning Model:</b> Trained using Jupyter Notebook, the model utilizes convolutional neural networks (CNNs) to classify images of crops into diseased or healthy categories.</li>
  <li><b>API Backend:</b> Developed with FastAPI, the backend serves as the interface between the machine learning model and the frontend. It handles incoming requests, processes data, and returns predictions.</li>
  <li><b>Drag and Drop Frontend:</b> Built with React JS, the frontend provides a user-friendly interface where users can upload images of crops, and receive instant feedback on their health status.</li>
  <li><b>API Integration:</b> Axios is utilized for seamless integration between the frontend and backend, ensuring efficient communication and data exchange.</li>
</ul>

# Usage
To run the system locally, follow these steps:

1. Start the FastAPI Python server:
```bash
    uvicorn app:app --reload
```
2. Start the React frontend:
```bash
    npm run dev
```
3. Access the application via your browser.
