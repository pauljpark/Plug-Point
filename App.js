import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Map from './src/components/map'
import Favorites from './src/components/favorites'
import Home from './src/components/home'
import { View, Text, Alert } from 'react-native'
import MapContext from './context'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class App extends Component {
  constructor() {
    super()
      this.state = {
        locations: []
      }
  }

  componentDidMount() {
    this.getAllLocs()
  }

  // saveLoc(d) {
  //   Alert.alert('Location Saved!') 
  //     let tempL = this.state.locations
  //     this.setState({
  //       locations: [d,...tempL]
  //     })
  //     console.log(tempL)
  // }
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

  logOut() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        <Text>Are you sure you want to log out?</Text>
      </View>
    )
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
          <Tab.Screen 
            name='Log Out'
            component={this.logOut}
          />
        </Tab.Navigator>
      </NavigationContainer>
      </MapContext.Provider>
    )
  } 
}