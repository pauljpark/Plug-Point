import React, { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { Title, Subheading, Button, TextInput } from 'react-native-paper'
import { setToken } from './api/token'
import { mockSuccess } from './api/mock'
import axios from 'axios'
import Spinner from 'react-native-loading-spinner-overlay'
import { LogoutContext } from '../context';
import { useContext } from 'react';

export default function LoginScreen({ navigation }) {
    const [email, onChangeEmail] = useState('')
    const [password, onChangePassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    //const onAuthentication = () => navigation.navigate('Main Screen')

    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    //accessing context here
    const thing = useContext(LogoutContext)
    const navToMain = () => thing.start(true)

    const login = () => {
      if (email === '' || password === '') {
        setErrorMessage('Please fill out the form!')
        setEmailError(email === '')
        setPasswordError(password === '')
      } else {
        axios.get('http://192.168.1.153:8000/users/')
        .then(res => {
          const filter = res.data.filter(e => e.email === email && e.password === password)
          console.log(filter)
      if (filter[0] === undefined) {
        setErrorMessage('The e-mail or password is incorrect.\nPlease try again.')
        setEmailError(true)
        setPasswordError(true)
        //if email & password entered matches from the get request, log user in
      } else if (filter[0].email === email && filter[0].password === password) {
        //display logging in overlay
        setLoading(true)
        //pass in value of "successful_fake_token" and return it
        loggingIn()
        //then get that value of "successful_fake_token"
        .then((async (res) => {
          //pushes name back to parent component so "Home" screen can display it
          const nameSet = () => (thing.nameSetter(filter[0].firstName))
          //set the token to the response received which is "successful_fake_token"
          await setToken(res.accessToken)
            //call nameSet   
            nameSet()
            //return inputs to blank
            onChangeEmail(''),
            onChangePassword('')
            setErrorMessage('')
            //onAuthentication()
            //unmount logging in screen
            setLoading(false)
            //call navToMain which will bring user to "Home" screen
            navToMain()
          })).catch((res) => setErrorMessage(res.error))
        }})
      .catch(err => console.log('Error is: ', err))
      }
    }
    

  const loggingIn = () => {
    return mockSuccess({ accessToken: 'successful_fake_token' })
  }

    return (
      <View style={styles.container}>
            <Spinner 
              visible={loading}
              textContent={'Logging In...'}
              textStyle={{color: '#FFF'}}
            />
          <Title style={styles.text}>Sign In</Title>
              <Text></Text>
                {errorMessage ? 
                  <Subheading style={styles.errMessage}>{errorMessage}</Subheading> 
                : null}
              <TextInput
                style={styles.input}
                onChangeText={(text) => onChangeEmail(text)}
                value={email}
                keyboardType='email-address'
                placeholder='E-mail'
                mode='flat'
                error={emailError}
                autoFocus
              />
              <TextInput 
                style={styles.input}
                onChangeText={(text) => onChangePassword(text)}
                value={password}
                secureTextEntry
                placeholder='Password'
                mode='flat'
                error={passwordError}
              />
              <Button
                onPress={login}
                mode='contained'
                contentStyle={{width: '100%'}}
                style={styles.button}
              >
                Log In
              </Button>
          </View>    
    )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    alignSelf: 'flex-start',
    paddingTop: 45,
    paddingLeft: 25,
    color: '#19996f',
    fontSize: 55,
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    width: 325,
    marginTop: 13,
    marginBottom: 13,
    textAlign: 'center',
  },
  button: {
    marginTop: 13,
    marginBottom: 13,
  },
  errMessage: {
      color: '#D32F2F',
      textAlign: 'center'
  }
})