import React, { useState, useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Title, Subheading, Button, TextInput } from 'react-native-paper'
import { mockSuccess } from './api/mock'
import { setToken } from './api/token'
import axios from 'axios'
import Spinner from 'react-native-loading-spinner-overlay'
import { LogoutContext } from '../context'

export default function CreateUserForm({ navigation }) {
    const [firstName, onChangefirstName] = useState('')
    const [lastName, onChangelastName] = useState('')
    const [email, onChangeEmail] = useState('')
    const [password, onChangePassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    //const onAuthentication = () => navigation.navigate('Main Screen')
    
    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const checkEmail = (e) => {
        const validate = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return validate.test(String(e).toLowerCase())
    }

    //to access context
    const thing = useContext(LogoutContext)
    const navToMain = () => thing.start(true)

    const submit = () => {  
        if (firstName === '' || lastName === '' || email === '' || password === '') {
            setErrorMessage('Please fill out the form!')
            setFirstNameError(firstName === '')
            setLastNameError(lastName === '')
            setEmailError(email === '')
            setPasswordError(password === '')
        } else if (password.length < 5) {
            setErrorMessage('Password must be at least 5 characters!')
            setPasswordError(true)
        } else if (checkEmail(email) === false) {
            setErrorMessage('Please enter a valid e-mail address!')
            setEmailError(true)
        } else {
            axios.get('http://192.168.1.153:8000/users/')
            .then((res => { 
                const filter = res.data.filter(e => e.email === email)
                console.log(filter)
                if (filter[0] === undefined) {
                    setLoading(true)
                    createAccount(firstName, lastName, email, password)
                    .then(async (res) => {
                        const nameSet = () => (thing.nameSetter(firstName))
                        await setToken(res.accessToken)
                        nameSet()
                        //onAuthentication()
                        setLoading(false)
                        navToMain()
                    })
                    .catch((res) => setErrorMessage(res.error))
                } else if (filter[0].email === email) {
                    setErrorMessage('This e-mail already exists. Please try again.')
                    setEmailError(true)
            }}))
            .catch(err => console.log('Error is: ', err))
        }
    }

    const createAccount = (firstName, lastName, email, password) => {
        
        console.log(firstName, lastName, email, password)
    
        const info = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }
    
        axios.post('http://192.168.1.153:8000/users/add', info)
                .then(res => console.log(res.data))
                .catch(err => console.log('Error is: ', err))
        
        return mockSuccess({ accessToken: 'successful_fake_token' })
    }

    return (
        <>
        <View style={styles.container}>
        <Spinner 
            visible={loading}
            textContent={'Logging In...'}
            textStyle={{color: '#FFF'}}
        />
        <Title style={styles.text}>Create Account</Title>
            <Text></Text>
            {errorMessage ? <Subheading style={styles.errMessage}>{errorMessage}</Subheading> : null}
            <TextInput
                style={styles.input}
                onChangeText={(text) => onChangefirstName(text)}
                value={firstName}
                placeholder='First Name'
                error={firstNameError}
                autoFocus
            />
            <TextInput
                style={styles.input}
                onChangeText={(text) => onChangelastName(text)}
                value={lastName}
                placeholder='Last Name'
                error={lastNameError}
            />
            <TextInput
                style={styles.input}
                onChangeText={(text) => onChangeEmail(text)}
                value={email}
                keyboardType='email-address'
                placeholder='E-mail Address'
                error={emailError}
            />
            <TextInput 
                style={styles.input}
                onChangeText={(text) => onChangePassword(text)}
                value={password}
                secureTextEntry
                placeholder='Password'
                error={passwordError}
            />
            <Button
                style={styles.button}
                contentStyle={{width: '100%'}}
                onPress={submit}
                mode='contained'
                error={errorMessage}
            >
                Sign Up
            </Button>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff'
      },
    text: {
        textAlign: 'center',
        alignSelf: 'flex-start',
        paddingTop: 35,
        paddingLeft: 25,
        color: '#19996f',
        fontSize: 45,
        fontWeight: 'bold',
    },
    input: {
        height: 45,
        width: 325,
        marginTop: 13,
        marginBottom: 13,
        textAlign: 'center'
    },
    button: {
        marginTop: 13,
        marginBottom: 13,
    },
    errMessage: {
        color: '#D32F2F'
    }
})