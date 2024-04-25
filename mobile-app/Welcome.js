import React from 'react';
import wave from './assets/wave.png';
import { StyleSheet, View, Image, Text } from 'react-native';

const Welcome = () => {
  return (
    <View style={styles.welcomeBody}>
      <View>
        <Image source={ wave } style={styles.bodyImage}/> 
        <Text style={styles.bodyText}>Hello there!</Text>
        <Text style={styles.bodyText}>Welcome to Crop Oracle</Text>
      </View>
      <Text style={styles.bodyPText}>Click the Gallery icon to upload an image, or the Camera icon to take a picture</Text>
      <View  style={styles.bodyPInfoText}>
        <Text>Upload or take a photo</Text>
        <Text>System checks if it is a crop-leaf first</Text>
        <Text>If yes, it proceeds to disease detection</Text>
        <Text>Then displays the results</Text>
      </View>
      <Text style={styles.bodyFText}>Thank you for using Crop Oracle!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  welcomeBody:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    flex: 1,
  },

  bodyImage:{
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 10,
  },

  bodyText:{
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },

  bodyPText:{
    textAlign: 'center',
    fontSize: 20,
  },

  bodyPInfoText:{
    display: 'flex',
    textAlign: 'center',
    gap: 5,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'gray',
    padding: 30,
  },
  bodyFText:{
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Welcome