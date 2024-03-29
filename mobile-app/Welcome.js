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
      <Text style={styles.bodyPText}>Click the 'Gallery' to upload an image, or the 'Camera' button to take a picture</Text>
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

  bodyFText:{
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Welcome