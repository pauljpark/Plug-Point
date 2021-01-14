import React, { Component } from 'react'
import { View, Text, Button, StyleSheet, Linking, Alert, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

class Favorites extends Component {
    constructor() {
      super() 
        this.state = {
              locations: []
        }
    }
  
    componentDidMount() {
      this.getAllLocs()
    }

  //when component is mounted, data from asyncstorage is set to state locations
  getAllLocs = async () => {
    let locs = []
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

  //navigate to location with name passed from the button
  navToLoc = async (name) => {
    try {
      const coords = await AsyncStorage.getItem(name)
      Linking.canOpenURL("comgooglemaps")
        .then((canOpen) => {
            console.log(canOpen)
            if (canOpen) { 
                Linking.openURL(`comgooglemaps://?daddr=${coords}&directionsmode=driving`) 
            } else { 
                Linking.openURL(`http://maps.apple.com/?daddr=${coords}`) 
            }
        })
    } catch(err) {
      console.log('error', err)
    }
  } 

  //delete the location with name passed from the button
  removeLoc = async (name) => {
    try {
      await AsyncStorage.removeItem(name)
    } catch(error) {
      console.log('Error:', error)
    }

    Alert.alert('Location removed')

  }

    //render each saved location by mapping
    render() {
      if (this.state.locations !== undefined) {
        return (
          <View style={styles.container}>
            <ScrollView>
            {this.state.locations.map((name, index) => {
              return <View key={index}>
                      <Text style={styles.nameText}>{name}</Text>
                        <View style={styles.fix}>
                          <Button 
                            title='Go'
                            onPress={() => this.navToLoc(name)}
                          />
                          <Button 
                            title='Delete'
                            onPress={() => this.removeLoc(name)}
                          />
                        </View>
                      </View>
            })}
            </ScrollView>
          </View>
        )
      } else {
          return (
            <View style={styles.noFavText} >
              <Text>No Favorites Saved Yet!</Text>
            </View>
          )}
      }
  }

export default Favorites

 const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: '10%',
      paddingTop: '20%',
      paddingRight: '10%'
    },
    nameText: {
      textAlign: 'center'
    },
    noFavText: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    fix: {
      flexDirection: 'row',
      justifyContent: 'space-around'
    }
 })