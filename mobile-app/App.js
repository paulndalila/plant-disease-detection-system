import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Button, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { shareAsync } from 'expo-sharing';
import { Camera, camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import logo from './assets/iconn.png';

export default function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading ] = useState(false);
  const [ cropClass, setCropClass ] = useState('');
  const [isImageSet, setIsImageSet] = useState(false);
  const [ cropAccuracy, setCropAccuracy ] = useState('');
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
  },[]);

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

      const response = await axios.post('http://10.0.9.237:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setCropClass(response.data.class);
      setCropAccuracy(response.data.accuracy);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
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
  }
  

  return (
    <>
      { isImageSet?
        <View style={styles.container}>
          <StatusBar style="auto"/>
          <View style={styles.navbar}>
            <View style={styles.logo}>
              <Image source={ logo } />
              <Text style={styles.logoText}>Crop Oracle</Text>
            </View>
            <Text style={styles.logoHelpText}>Need help?</Text>
          </View>
          <View style={styles.banner}><Text style={styles.bannerText}>Crop Oracle is a plant disease detection system that detects diseases in plants by examining the crop leaf using machine learning.</Text></View>
          
          <View style={styles.body}>
            
          { isImageSet ? <View style={styles.buttonContainer}><Button title="Check crop status" onPress={uploadImage} /><Button title="select different crop" onPress={resetView} /></View> : ''}

            { isImageSet ? <View style={styles.imageContainer}>
                <Image source={ image } style={styles.image} /> 

                { loading? <ActivityIndicator color='#017260' size='large'/> : ''}
                <Text>Potato Health Status: {cropClass}</Text>
                <Text>Accuracy: {cropAccuracy}</Text>
              </View> : <View><Text style={styles.noImage}>No image selected</Text></View>}
          </View>
        </View>
        :
        <Camera style={styles.container} ref={cameraRef}>
          <StatusBar style="auto"/>
          <View style={styles.buttonContainer}>
            <Button title='Take Pic' color='#1b1c1e' onPress={takePic}/>
            <Button title='Gallery' color='#1b1c1e' onPress={pickImage}/>
          </View>
        </Camera>
    }

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#ffffffb2',
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

  body:{
    padding: 10,
  },
  image: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    height: 500,
    width: 380,
    objectFit: 'contain',
    paddingRight: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  navbar:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoText:{
    fontSize: 26,
    fontWeight: 'bold',
    color: '#017260',
    paddingTop: 8,
  },
  imageContainer:{
    overflow: 'hidden',
    borderRadius: 5,
  },
  logoHelpText:{
    fontSize: 16,
    paddingRight: 10,
    fontWeight: 'bold',
    color: '#017260',
  },
  logo: {
    paddingLeft: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  banner:{
    padding: 10,
    backgroundColor: '#017260',
  },
  bannerText:{
    color: '#fff',
    textAlign: 'center',
  },
  noImage:{
    textAlign: 'center',
    padding: 10,
    color: 'gray',
  }
});
