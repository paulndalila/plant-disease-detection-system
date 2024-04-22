import { useState, useRef } from "react"
import axios from "axios";
import Alert from '@mui/material/Alert';
import image_icon from "./images/img.png";
import CircularProgress from '@mui/material/CircularProgress';

const Home = () => {
    const fileInputRef = useRef(null);
    const [data, setData] = useState(null);
    const [ image, setImage ] = useState([]);
    const [ result, setResult ] = useState(false);
    const [ isImage, setIsImage ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ errorMsg, setErrorMsg ] = useState(null);
    const [ isDragging, setIsDragging ] = useState(false);

    //browsed an image
    const onFileSelect = async (event) => {
        const image_file = event.target.files;
        await loadData(image_file);
    }

    //Drag and drop from cursor
    const onDrop = async(e)=>{
        e.preventDefault();
        setIsDragging(false);
        const image_file = e.dataTransfer.files;
        await loadData(image_file);
    }

    //compress the image to 256*256
    async function compressImage(file, quality) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (event) {
                const image = new Image();
                image.src = event.target.result;
                image.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
    
                    // Set canvas size to 256x256
                    canvas.width = 256;
                    canvas.height = 256;
    
                    // Resize image to fit 256x256
                    ctx.drawImage(image, 0, 0, 256, 256);
    
                    // Convert canvas to compressed data URL
                    const compressedDataURL = canvas.toDataURL('image/jpeg', quality);
    
                    resolve(compressedDataURL);
                };
                image.onerror = function (error) {
                    reject(error);
                };
            };
            reader.onerror = function (error) {
                reject(error);
            };
        });
    }
    
    // Convert data URI of the compressed image to Blob
    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }


    //pass the image onto the api for a prediction
    const loadData = async (the_image)=>{
        setLoading(true);
        setErrorMsg(false);

        try { 
            const compressedImageDataURL = await compressImage(the_image[0], 1);
    
            const formData = new FormData();
            formData.append('file', dataURItoBlob(compressedImageDataURL), 'compressed_image.jpg');
            setImage(compressedImageDataURL);
    
            // Submit compressed image to the API     
            // backend hosted on render - https://paulndalila-backend-api.onrender.com/
            // backend hosted on AWS EC2 instance - http://16.171.64.119
            const response = await axios.post('https://paulndalila-backend-api.onrender.com/predict', formData);  
            if(response.data['class'] === '0' || response.data['accuracy'] === 0.0){
                setIsImage(false);
            }else{
                setIsImage(true);
                setData(response.data);
            }
            setResult(true);

        } catch (error) {
            setErrorMsg(error.code);
        }finally{
            setLoading(false);
        }
    }

    const selectFiles = ()=>{
        fileInputRef.current.click();
    }

    function onDragOver(e){
        e.preventDefault();
        setIsDragging(true);
        e.dataTransfer.dropEffect = "copy;"
    }

    function onDragLeave(e){
        e.preventDefault();
        setIsDragging(false);

    }

    const selectNewCrop = ()=>{
        setResult(false);
    }

    const accuracyCalc = (acc)=>{
        const percentage = acc * 100;
        return percentage.toFixed(2);
    }

  return (
    <div className="card">
        <select className="top crop_type" disabled={result}>
            <option>Potato</option>
            <option>Cassava</option>
            <option>Tomatoes</option>
        </select>

        { errorMsg? <Alert variant="filled" className="error" severity="error">{ errorMsg }</Alert> : '' }

        { loading? <div className="loading"><CircularProgress color="success"/></div>:
            <>
                { result?
                    <div className="drag_area result"  onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                        <div className="image"><img src={ image } alt="crop-img"/></div>
                        <div className="details">
                            { isImage?
                                <>
                                    <div>
                                        <h3>Potato health status</h3>
                                        <hr/>
                                        <p className="class"><b>{ data['class'] }</b></p>
                                    </div>
                                    <div>
                                        <h3>Accuracy</h3>
                                        <hr/>
                                        <p className="accuracy"><b>{ accuracyCalc(data['accuracy']) }%</b></p>
                                    </div>
                                    <div className="btn">
                                        <button onClick={selectNewCrop}>Check another crop</button>
                                    </div>
                                </>
                                :
                                <>
                                    <h2 className="accuracy">Crop Oracle system did <u>not identify</u> the leaf in the image! <br/> Upload an image of a <u>crop leaf only</u> for <u>status detection</u>!</h2>
                                </>                            
                            }
                        </div>
                    </div> :
                        <div className="drag_area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                            {isDragging? (
                                <span className="select selected">Drop images here</span>
                            ):(
                                <div className="drop_area">
                                    <div>
                                        Drag & Drop image here or {''}
                                        <span className="select" role="button" onClick={selectFiles}>
                                            Browse
                                        </span>
                                    </div>

                                    <div><img src={ image_icon } alt="icon" /></div>

                                </div>
                            )}
                            <input type="file" name="file" className="file" multiple ref={fileInputRef} onChange={onFileSelect}></input>
                        </div>
                }
                
            </>
        }
    </div>
  )
}

export default Home
