import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Map from './src/components/map'
import Favorites from './src/components/favorites'
import Home from './src/components/home'
import { Alert } from 'react-native'
import MapContext from './context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';

export default class App extends Component {
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
      if (locs != null) {
        this.setState({
          locations: locs
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
      <MapContext.Provider value={{ locs: this.state.locations, 
                                    saveLoc: this.saveLoc, 
                                    removeLoc: this.removeLoc 
                                  }}>
      <NavigationContainer>
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
      </NavigationContainer>
      </MapContext.Provider>
    )
  } 
}