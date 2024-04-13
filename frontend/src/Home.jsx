import { useState, useRef } from "react"
import axios from "axios";
import Alert from '@mui/material/Alert';
import image_icon from "./images/img.png";
import CircularProgress from '@mui/material/CircularProgress';

const Home = () => {
    const [image, setImage] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const [data, setData] = useState(null);
    const [ result, setResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ errorMsg, setErrorMsg ] = useState(null);

    const selectFiles = ()=>{
        fileInputRef.current.click();
    }

    const onFileSelect = async (event) => {
        const files = event.target.files;
        setLoading(true);
        setErrorMsg(false);
        const formData = new FormData();
        formData.append('file', files[0]);
        setImage(URL.createObjectURL(files[0]));

        try {          
            const response = await axios.post('https://paulndalila-backend-api.onrender.com/predict', formData);  
            setData(response.data);  
            setResult(true);         

        } catch (error) {
            setErrorMsg(error.code);
            //setErrorMsg(error.response.data.message);
        }finally{
            setLoading(false);
            console.log('done');
        }

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

    const onDrop = async(e)=>{
        e.preventDefault();
        setIsDragging(false);
        setLoading(true);
        setErrorMsg(false);

        const files = e.dataTransfer.files;

        const formData = new FormData();
        formData.append('file', files[0]);
        setImage(URL.createObjectURL(files[0]));

        try {          
            const response = await axios.post('https://paulndalila-backend-api.onrender.com/predict', formData);  
            setData(response.data);
            setResult(true);

        } catch (error) {
            setErrorMsg(error.code);
        }finally{
            setLoading(false);
        }
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