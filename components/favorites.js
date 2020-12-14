import React, { Component } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class Favorites extends Component {
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

    //render each saved location by mapping
    render() {
      if (this.state.locations !== null) {
        return (
          <View style={styles.container}>
            {this.state.locations.map((item, index) => {
              return <View key={index} >
                      <Text>{item}</Text>
                        <Button title='Navigate' />
                        <Button title='Remove' />
                    </View>
            })}
          </View>
        )
      }
    }
  }

 const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
 })