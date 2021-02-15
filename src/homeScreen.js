import React from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { Video } from 'expo-av'
import { Title, Subheading, Button } from 'react-native-paper'

export default function HomeScreen({ navigation }) {

    const video = React.useRef(null)

    return (
      <View style={styles.container}>
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: 'https://qu.ax/AYF.mp4'
          }}
          resizeMode='stretch'
          isLooping
          shouldPlay
        />
          <View style={styles.innerFrame}>
            <View style={styles.heading}>
              <Title style={styles.text}>plugpoint</Title>
              <Subheading style={styles.subheading}>Go where you want. With a peace of mind.</Subheading>
            </View>
            <Button 
              style={styles.buttons}
              contentStyle={{width: '100%'}}
              labelStyle={{fontSize: 15}}
              mode="contained" 
              onPress={() => (navigation.navigate('Login Screen'))}
            >
              Log In With Email
            </Button>
            <Text></Text>
            <Button 
              style={styles.buttons}
              contentStyle={{width: '100%'}}
              labelStyle={{fontSize: 15}}
              mode="outlined" 
              onPress={() => (navigation.navigate('User Form'))}
            >
              Sign Up
            </Button>
          </View>        
      </View>
    )
  }


const styles = StyleSheet.create({
  text: {
    paddingTop: 60,
    color: '#fff',
    fontSize: 80,
    fontWeight: 'bold',
  },
  heading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '20%',
    marginBottom: 110
  },
  subheading: {
    color: '#9D8D8D',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerFrame: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    width: '100%',
  },
  video: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  buttons: {
    borderRadius: 20,
    borderWidth: 4,
    bottom: 80,
  }
})