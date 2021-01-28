import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View, ImageBackground } from 'react-native'
import { Title, Subheading } from 'react-native-paper'
import { FontAwesome, AntDesign } from '@expo/vector-icons'
import Background from '../../public/background.png'

export default class Home extends Component {
    render() {
        return (
          <View style={styles.container}>
            <ImageBackground source={Background} style={styles.image}>
              <Title style={styles.text}>hello user.</Title>
                <AntDesign style={styles.icon} name="minus" size={20} color="#fffff0" />
                  <Subheading style={styles.text}>
                    to get started</Subheading>
                    <Subheading style={styles.text}>
                    click the Map tab to find charging stations near you
                    {'\n'}
                    save your desired stations to Favorites
                  </Subheading>
                <AntDesign style={styles.icon} name="minus" size={20} color="#fffff0" />
              <Title style={styles.text}>happy charging  <FontAwesome style={styles.icon} name="plug" size={13} color="#fffff0" /></Title>
            </ImageBackground>
          </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    textAlign: 'left',
    marginLeft: '8%',
    marginRight: '8%',
    padding: '2%'
  },
  icon: {
    textAlign: 'left',
    marginLeft: '8.5%',
    padding: '1%'
  }
})