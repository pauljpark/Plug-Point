import React, { Component } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Map from './src/components/map'
import Favorites from './src/components/favorites'
import Home from './src/components/home'
import { Alert, StyleSheet, View } from 'react-native'
import { MapContext, LogoutContext } from './context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay'

export default class TabApp extends Component {
  constructor() {
    super()
      this.state = {
        locations: [],
        logoutOverlay: true
      }
  }

  componentDidMount() {
    this.getAllLocs()
  }

  saveLoc = async (dest, coords) => {
        try {
            await AsyncStorage.setItem(dest, coords)
            //call getAllLocs to render all locations
            this.getAllLocs()
        } catch (error) {
            console.log('Error:', error)
        }
        Alert.alert('Saved to Favorites!')
    }

  removeLoc = async (dest) => {
      try {
        await AsyncStorage.removeItem(dest)
        const updatedList = this.state.locations.filter((list) => list !== dest)
        this.setState({
          locations: updatedList
        })
      } catch(error) {
        console.log('Error:', error)
      }
      Alert.alert('Location Removed')
    }  

  getAllLocs = async () => {
    try {
      locs = await AsyncStorage.getAllKeys()
      //filter out token in AsyncStorage
      locsNoToken = (locs.filter(e => e !== 'auth_token'))
      if (locs != null) {
        this.setState({
          locations: locsNoToken
        })
      } else {
        return null
      }
    } catch(error) {
      console.log('Error:', error)
    }
  }

  render() {
    const Tab = createBottomTabNavigator()
    return (
      <LogoutContext.Consumer>{context => {
        return (
          <>
            <View style={styles.container}>
                <Spinner 
                  visible={context.log}
                  textContent={'Logging Out...'}
                  textStyle={{color: '#FFF'}}
                  style={{position: 'absolute'}}
                  overlayColor='rgba(0, 0, 0, 0.7)'
                />
            </View>
            <MapContext.Provider value={{ locs: this.state.locations, 
                                    saveLoc: this.saveLoc, 
                                    removeLoc: this.removeLoc 
                                        }}>
            <Tab.Navigator
              initialRouteName='Home'
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  if (route.name === 'Home') {
                    return (
                      <MaterialCommunityIcons
                        name={
                          focused
                            ? 'home-variant'
                            : 'home-variant-outline'
                          }
                        size={size}
                        color={color}
                      />
                    )
                  } else if (route.name === 'Map') {
                    return (
                      <MaterialCommunityIcons
                        name={focused ? 'map' : 'map-outline'}
                        size={size}
                        color={color}
                      />
                    )
                  } else if (route.name === 'Favorites') {
                    return (
                      <MaterialIcons
                        name={focused ? 'favorite' : 'favorite-border'}
                        size={size}
                        color={color}
                      />
                    )
                  }
                },
              })}
              tabBarOptions={{
                activeTintColor: '#19996f',
                inactiveTintColor: 'gray',
                activeBackgroundColor: '#fff',
                inactiveBackgroundColor: '#fff',
              }}
                  >
          <Tab.Screen 
            name='Home'
            component={Home}
          />
          <Tab.Screen 
            name='Map'
            component={Map}
          />
          <Tab.Screen 
            name='Favorites'
            component={Favorites}
          />
        </Tab.Navigator>
      </MapContext.Provider>
      </>
        )
      }}
    </LogoutContext.Consumer>
    )
  } 
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
  }
})