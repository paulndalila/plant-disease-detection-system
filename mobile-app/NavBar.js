import React from 'react';
import logo from './assets/iconn.png';
import { StyleSheet, View, Text, Image } from 'react-native';

const NavBar = () => {
  return (
    <>
        <View style={styles.navbar}>
            <View style={styles.logo}>
                <Image source={ logo } />
                <Text style={styles.logoText}>Crop Oracle</Text>
            </View>
            <Text style={styles.logoHelpText}>Need help?</Text>
        </View>

        <View style={styles.banner}>
            <Text style={styles.bannerText}>Crop Oracle is a plant disease detection system that detects diseases in plants by examining the crop leaf using machine learning.</Text>
        </View>
    </>
  )
}

const styles = StyleSheet.create({
    
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
  logoHelpText:{
    fontSize: 20,
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
});

export default NavBar