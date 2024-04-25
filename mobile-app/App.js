import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { Camera } from 'expo-camera';
import Welcome from './Welcome';
import back1 from './assets/backa.jpg';
import leaf from './assets/leaf.png';
import NavBar from './NavBar';
import Footer from './Footer';
import { manipulateAsync } from 'expo-image-manipulator';

export default function App() {
  const [image, setImage] = useState(null);
  const [ compressedImage, setCompressedImage ] = useState(null);
  const [loading, setLoading ] = useState(false);
  const [ cropClass, setCropClass ] = useState('');
  const [isImageSet, setIsImageSet] = useState(false);  
  const [ cropAccuracy, setCropAccuracy ] = useState('');
  const [ isCameraSet, setIsCameraSet ] = useState(false);
  const [ isALeaf, setIsALeaf ] = useState(false);
  const [ resultsAvailable, setResultsAvailable] = useState(false);
  const [ hasCameraPermission, setHasCameraPermission] = useState();

  let cameraRef = useRef();

  //image selection from gallery
  const pickImage = async (e) => { 
    e.preventDefault();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4,3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0]);
      setIsImageSet(true);  
      setIsCameraSet(false);             
      setResultsAvailable(false);
    }
  };

  //checking for camera permissions
  useEffect(()=>{
    (async ()=>{
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status ==="granted");
    })();
  },[ ]);

  useEffect(()=>{
    if(image !== null){
      compressImage(image);
    }
  },[image])

  const compressImage = async( uploaded_image ) => {
    //console.log('starting compression')
    try{
      const compressed_image = await manipulateAsync(
        uploaded_image.uri,
        [{ resize: { width: 256, height: 256 } }],
        { compress: 1, format: 'jpeg' }
      );

      setCompressedImage(compressed_image);
      // console.log('compressedImage')
      // console.log(compressed_image)
    }catch(error){
      console.error(error)
    }
  }

  if(hasCameraPermission === undefined){
    return <Text>Requesting permissions...</Text>
  }else if(!hasCameraPermission){
    return <Text>Permissions for camera not granted</Text>
  }

  //camera take pic
  let takePic = async ()=>{   
    try{
      let options = {
        quality: 1,
        base64: true,
        exif: false,
      };
  
      let newPhoto = await cameraRef.current.takePictureAsync(options);
      setImage(newPhoto);
      setIsCameraSet(false);
    }catch(error){
      Alert.alert('Error', 'Failed to take pic');
    }finally{
      setIsImageSet(true);      
      setIsCameraSet(false);             
      setResultsAvailable(false);
    }
  }

  //uploading to my backend api
  const uploadImage = async () => {

    if(compressedImage){
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', {
          name: 'image.jpg',
          uri: compressedImage.uri,
          type: 'image/jpeg',
        });

  	    // backend hosted on render - https://paulndalila-backend-api.onrender.com
	      // backend hosted on AWS EC2 instance - http://ec2-16-171-64-119.eu-north-1.compute.amazonaws.com or http://16.171.64.119
        const response = await axios.post('http://16.171.64.119/predict', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setCropClass(response.data.class);
        setCropAccuracy(response.data.accuracy);

        if((response.data.class) === 'Not a leaf' || (response.data.accuracy) === 0.0){
          setIsALeaf(false)
        }else{
          setIsALeaf(true)
        }
        
        setResultsAvailable(true);
  
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally{
        setLoading(false);
      }
    }

  }

  //resetting hooks-- their values
  const resetView = ()=>{
    setImage(null);
    setCropClass('');
    setCropAccuracy('');
    setIsImageSet(false);
    setResultsAvailable(false);
    setIsCameraSet(false);
  }

  // camera button toggle
  const toggleCamera = ()=>{
    setIsCameraSet(true);
  }

  //converting accuracy to two decimal places
  const accuracyCalc = (acc)=>{
    const percentage = acc * 100;
    return percentage.toFixed(2);
  }  

  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      { isCameraSet?
        <Camera style={styles.container} ref={cameraRef}>
          <View style={styles.container}>

          </View>
          <View style={styles.buttonContainer}>
            <Button icon={<Icon name="image" size={32} color="#fff" /> } type="clear" onPress={pickImage}/>
            <Button icon={<Icon name="camera" size={55} color="#fff" /> } type="clear" onPress={takePic}/>
            <Button icon={<Icon name="arrow-right" size={30} color="#fff" /> } type="clear" onPress={resetView}/>
          </View>
        </Camera>      
      :
        <View style={styles.contentContainer}>
          <NavBar/>
          <View style={styles.body}>
              <Image source={ back1 } style={styles.backgroundImage}/>

              <View style={styles.bodyFrame}>

                <View style={styles.bodyFrameNavigationBar}>
                  <View style={styles.bodyFrameTitle}> 
                    <Image source={ leaf }/> 
                    <Text style={styles.bodyFrameTitleText}>Potato Leaf</Text>                
                  </View>

                  <View style={styles.bodyFrameButtons}> 
                    { resultsAvailable ? 
                      <>
                        <Button icon={ <Icon name="image" size={25} color="#017260" /> } type="clear" onPress={pickImage} />
                        <Button icon={<Icon name="camera" size={25} color="#017260" /> } type="clear" onPress={toggleCamera} />
                        <Button icon={<Icon name="undo" size={25} color="#017260" /> } type="clear" onPress={resetView} />
                      </>
                      : 
                      (image? 
                        <>
                          <TouchableOpacity onPress={uploadImage} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1976D2', borderRadius: 5, padding: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>Check Status</Text>
                            <Icon name="upload" size={18} color="#fff" style={{ marginLeft: 5 }} />
                          </TouchableOpacity>
                          <Button icon={<Icon name="undo" size={25} color="#017260" /> } type="clear" onPress={resetView} />
                        </> 
                        : 
                        <>
                          <Button icon={<Icon name="image" size={25} color="#017260" /> } type="clear" onPress={pickImage} />
                          <Button icon={<Icon name="camera" size={25} color="#017260" /> } type="clear" onPress={toggleCamera} />
                        </>
                      )
                    }
                  </View>
                </View>

                { isImageSet?
                  <>
                    <View style={styles.imageContainer}>
                      <Image source={ image } style={styles.image} />
                    </View>
                    
                    { loading? <ActivityIndicator color='#017260' size='large'/> : ''}

                    { resultsAvailable? 
                      <>
                        <Text>Results:</Text>
                        <View style={styles.imageResults}>
                          { isALeaf? <Text style={styles.imageCResults}>{ cropClass }</Text> : <Text style={styles.imageCResults}>Not a Crop Leaf!</Text> }
                          { isALeaf? <Text style={styles.imageAResults}>{ accuracyCalc(cropAccuracy) }%</Text> : <Icon name="close" color="red" size={44} style={styles.icon} /> }
                        </View>
                      </>
                    
                      : 
                      
                      ''
                    }
                    
                  </>

                  : <Welcome/> 
                }
                            
              </View>
          </View>

          <Footer/>
        </View>
      }

    </>
  );
}

const styles = StyleSheet.create({

//container
  container: {
    flex: 1,
  },

  contentContainer:{
    flex: 1,
    paddingTop: 40,
  },
  buttonContainer:{
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 20,
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  imageContainer:{
    height: 500,
    overflow: 'hidden',
    //backgroundColor: '#017260',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 4,
  },

  image: {
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '100%',
    width: '100%',
    objectFit: 'fill',
    paddingRight: 10,
    marginBottom: 10,
    borderRadius: 5,
  },

  imageResults:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginBottom: 10,
  },

  imageCResults:{
    fontSize: 40,
    color: '#01493E',
    fontWeight: 'bold',
  },

  imageAResults:{
    width: '40%',
    fontSize: 36,
    color: '#D8323C',
    fontWeight: 'bold',
  },
    
  //body nav 
  body:{
    flex: 1,
    position: 'relative',
  },  

  bodyFrame:{
      width: '95%',
      flex: 1,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 10,
      borderColor: '#017260',
      borderWidth: 2,
      padding: 10,
      backgroundColor: '#ffffffd2',
  },

  bodyFrameNavigationBar:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  bodyFrameTitle:{
    gap: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  bodyFrameTitleText:{
    color: '#017260',
    fontSize: 18,
    fontWeight: 'bold',
  },

  bodyFrameButtons:{
    gap: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  backgroundImage:{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -99,
  },
  icon: {
    marginRight: 40,
  },
});
