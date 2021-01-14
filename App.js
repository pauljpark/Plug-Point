import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Map from './src/components/map'
import Favorites from './src/components/favorites'
import Home from './src/components/home'
import { View, Text } from 'react-native'

export default class App extends Component {

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
    )
  } 
}