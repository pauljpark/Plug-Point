import React, { useState } from 'react'
import CreateUserForm from './src/createUserForm'
import HomeScreen from './src/homeScreen'
import LoginScreen from './src/loginScreen'
import TabNav from './tabMain'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LogoutContext } from './context'
import { setToken } from './src/api/token'
import { mockSuccess } from './src/api/mock'

const Stack = createStackNavigator()

export default function App() {

  const [signedIn, setSignedIn] = useState(false)
  const [signedOut, setSignedOut] = useState(false)
  const [name, setName] = useState('')

  const login = (bool) => {
    setSignedIn(bool)
  }

  const logout = (bool) => {
    setSignedOut(bool)
    mockSuccess({ accessToken: '' })
            .then((async (res) => {
                await setToken(res.accessToken)
                //brings user back to home page
                setSignedIn(false)
                //unmounts logging off overlay
                setSignedOut(false)
            })).catch(err => console.log(err))
  }

  const nameSetter = (nameString) => {
    setName(nameString)
  }
   
  return (
      <LogoutContext.Provider value={{
                                  log: signedOut, 
                                  start: login,
                                  done: logout,
                                  nameSetter: nameSetter,
                                  userName: name
                                    }}
      >
        <NavigationContainer>
          <Stack.Navigator>
            {signedIn ? 
              <Stack.Screen name='Main Screen' 
                  component={TabNav} 
                  options={{
                      animationEnabled: false,
                      headerTitle: 'plugpoint',
                      headerRight: () => <MaterialCommunityIcons 
                                            name="logout" 
                                            size={27} 
                                            color="black" 
                                            onPress={() => logout(true)} 
                                            style={{width: 35}}
                                          />
                          }} 
              />
                  :
              <>
                <Stack.Screen 
                    name='Home' 
                    component={HomeScreen} 
                    options={{
                        headerShown: false, 
                        animationEnabled: false
                            }} 
                />                          
                <Stack.Screen 
                    name='Login Screen' 
                    component={LoginScreen} 
                    options={{headerShown: true}} 
                />
                <Stack.Screen 
                    name='User Form' 
                    component={CreateUserForm} 
                    options={{headerShown: true}} 
                />
              </>
              }
            </Stack.Navigator>
          </NavigationContainer>
       </LogoutContext.Provider>
  )
}