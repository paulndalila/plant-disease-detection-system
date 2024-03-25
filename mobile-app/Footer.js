import React from 'react'
import { StyleSheet, View, Text } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footerBanner}>
        <Text style={styles.footerText}>Copyright © 2024 | Paul_Ndalila Maseno University</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    
  //footer styling
  footerBanner:{
    backgroundColor: '#1b1c1e',
    padding: 5,
  },

  footerText:{
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
  },
});

export default Footer