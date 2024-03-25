import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Button, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { shareAsync } from 'expo-sharing';
import { Camera, camera } from 'expo-camera';
import Welcome from './Welcome';
import back1 from './assets/backa.jpg';
import crop from './assets/crop.jpg';
import leaf from './assets/leaf.png';
import cameraIcon from './assets/camera.png';
import galleryIcon from './assets/gallery.png';
// import * as MediaLibrary from 'expo-media-library';
import NavBar from './NavBar';
import Footer from './Footer';

export default function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading ] = useState(false);
  const [ cropClass, setCropClass ] = useState('');
  const [isImageSet, setIsImageSet] = useState(false);  
  const [ resultsAvailable, setResultsAvailable] = useState(false);
  const [ cropAccuracy, setCropAccuracy ] = useState('');
  const [ isCameraSet, setIsCameraSet ] = useState(false);
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
    }
  };

  //checking for camera permissions
  useEffect(()=>{
    (async ()=>{
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status ==="granted");
    })();

    if(image){      
      //console.log(image);
      uploadImage();
    }

  },[isCameraSet, image]);

  if(hasCameraPermission === undefined){
    return <Text>Requesting permissions...</Text>
  }else if(!hasCameraPermission){
    return <Text>Permissions for camera not granted</Text>
  }

  //camera take pic
  let takePic = async ()=>{   
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setImage(newPhoto);
    setIsImageSet(true);
  }

  //uploading to my backend api
  const uploadImage = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', {
        name: 'image.jpg',
        uri: image.uri,
        type: 'image/jpeg',
      });

      const response = await axios.post('192.168.137.229:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResultsAvailable(true);
      setCropClass(response.data.class);
      setCropAccuracy(response.data.accuracy);

    } catch (error) {
      console.error('Error uploading image:', error);
      console.log(image);
      //Alert.alert('Error', 'Failed to upload image');
    } finally{
      setLoading(false);
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
      { isCameraSet?
        <Camera style={styles.container} ref={cameraRef}>
          <StatusBar style="auto"/>
          <View style={styles.buttonContainer}>
            <Button title='Take Pic' color='#1b1c1e' onPress={takePic}/>
            <Button title='Gallery' color='#1b1c1e' onPress={pickImage}/>
          </View>
        </Camera>      
      :
        <View style={styles.container}>
          <StatusBar style="auto"/>

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
                    {/* <Image source={ galleryIcon } onPress={pickImage}/> 
                    <Image source={ cameraIcon } onPress={toggleCamera}/>                 */}
                    <Button title='Gallery' onPress={pickImage} />
                    <Button title='Camera' onPress={toggleCamera} />
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
                          <Text style={styles.imageCResults}>{ cropClass }</Text>
                          <Text style={styles.imageAResults}>{ accuracyCalc(cropAccuracy) }%</Text>
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
    paddingTop: 50,
    backgroundColor: '#fffffff',
  },
  buttonContainer:{
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  imageContainer:{
    height: 500,
    overflow: 'hidden',
    backgroundColor: 'plum',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 4,
  },

  image: {
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '100%',
    width: '100%',
    objectFit: 'cover',
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
    gap: 10,
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
});
