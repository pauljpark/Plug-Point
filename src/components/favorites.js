import React, { Component } from 'react'
import { View, Text, Button, StyleSheet, Linking, Alert, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MapContext from '../../context'

class Favorites extends Component {
    constructor() {
      super() 
        this.state = {
              locations: []
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

    //render each saved location by mapping
    render() {
      return (
          <MapContext.Consumer>{context => 
              {if (context.locs[0] !== undefined) {
                  return (
                      <View style={styles.container}>
                          <ScrollView>
                          {(context.locs.map((name, index) => {
                              return (
                                  <View key={index}>
                                      <Text style={styles.nameText}>{name}</Text>
                                          <View style={styles.fix}>
                                              <Button 
                                                  title='Go'
                                                  onPress={() => this.navToLoc(name)}
                                              />
                                              <Button 
                                                  title='Delete'
                                                  onPress={(d) => context.removeLoc(name)}
                                              />
                                          </View>
                                  </View>
                              )}))}
                          </ScrollView>
                      </View>
                  )
        } else {
            return (
              <View style={styles.noFavsText} >
                  <Text>No Favorites Saved!</Text>
              </View>
            )}
          }}
        </MapContext.Consumer>
      )}
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
    noFavsText: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    fix: {
      flexDirection: 'row',
      justifyContent: 'space-around'
    }
 })