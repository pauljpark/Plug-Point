import React, { Component } from 'react'
//import { AppLoading } from 'expo'
import { StyleSheet } from 'react-native'
import { View, ImageBackground } from 'react-native'
import { Title, Subheading } from 'react-native-paper'
import { FontAwesome, AntDesign } from '@expo/vector-icons'
import Background from '../../public/background.png'
//import { useFonts, Lato_400Regular, Lato_400Regular_Italic } from '@expo-google-fonts/lato'

export default function Home() {
  // let [fontsLoaded] = useFonts({
  //   Lato_400Regular,
  //   Lato_400Regular_Italic
  // })
  //   if (!fontsLoaded) {
  //     return <AppLoading />
  //   } else {
        return (
          <View style={styles.container}>
            <ImageBackground source={Background} style={styles.background}>
              <Title style={styles.text}>hello user.</Title>
                <AntDesign style={styles.icon} name="minus" size={20} color="#fffff0" />
                  <Subheading style={styles.text}>
                    to get started</Subheading>
                    <Subheading style={styles.text}>
                      tap the Map tab to find charging stations near you
                    </Subheading>
                    <Subheading style={styles.text}>
                      save your desired stations to Favorites
                    </Subheading>
                <AntDesign style={styles.icon} name="minus" size={20} color="#fff" />
              <Title style={styles.text}>happy charging  <FontAwesome style={styles.icon} name="plug" size={14} color="#fffff0" /></Title>
            </ImageBackground>
          </View>
        )
    //}
  }

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    textAlign: 'left',
    marginLeft: '8%',
    marginRight: '8%',
    padding: '2%',
    //fontFamily: 'Lato_400Regular',
    fontSize: 20
  },
  icon: {
    textAlign: 'left',
    marginLeft: '8.5%',
    padding: '1%'
  }
})