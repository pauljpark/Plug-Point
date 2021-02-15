import React, { Component } from 'react'
import { View, StyleSheet, Linking, ScrollView, LogBox, ImageBackground } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MapContext } from '../../context'
import { MaterialIcons, MaterialCommunityIcons, Fontisto } from '@expo/vector-icons'
import { SwipeListView } from 'react-native-swipe-list-view'
import { Title } from 'react-native-paper'
import Background from '../../public/favorites-background.png'

class Favorites extends Component {

  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.'])
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
        <ImageBackground source={Background} style={styles.background}>
          <MapContext.Consumer>{context => 
              {if (context.locs[0] !== undefined) {
                  return (
                      <View style={styles.container}>
                          <Fontisto 
                            style={styles.batteryIcon} 
                            name={context.locs.length > 4 ? "battery-full" : (context.locs.length === 3 || context.locs.length === 4) ? "battery-three-quarters" : context.locs.length === 2 ? "battery-half" : context.locs.length === 1 ? "battery-quarter" : null} 
                            size={350} 
                            color="#19996f" 
                          />
                          <ScrollView>
                          {(context.locs.map((name, index) => {
                              return (
                                <SwipeListView
                                    contentContainerStyle={styles.container}
                                    disableRightSwipe
                                    data={[name]}
                                    key={index}
                                    keyExtractor={([name]) => [name].toString()}
                                    renderItem={ (data, index) => (
                                      <View style={styles.chargerName}>
                                          <Title style={styles.nameText} numberOfLines={1}>{name}</Title>
                                          <MaterialIcons 
                                              style={styles.arrowLeft} 
                                              name="keyboard-arrow-right" 
                                              size={24} 
                                              color="black" 
                                          />
                                      </View>
                                    )}
                                  renderHiddenItem={ (data, rowMap) => (
                                    <View style={styles.fix}>
                                      <Title 
                                        style={styles.buttonGo}
                                        onPress={() => this.navToLoc(name)}
                                      >GO</Title>
                                      <MaterialCommunityIcons 
                                        name="delete-forever" 
                                        size={35} 
                                        color="black" 
                                        style={styles.buttonDelete}
                                        onPress={(d) => context.removeLoc(name)}
                                      />
                                    </View>
                                  )}
                                  leftOpenValue={75}
                                  rightOpenValue={-157}
                              />
                              )}))}
                          </ScrollView>
                      </View>
                      // <View style={styles.container}>
                      //     <ScrollView>
                      //     {(context.locs.map((name, index) => {
                      //         return (
                      //             <View key={index}>
                      //               <MaterialIcons style={styles.icon} name="ev-station" size={30} color="black" />
                      //                 <Text style={styles.nameText}>{name}</Text>
                      //                     <View style={styles.fix}>
                      //                         <Button 
                      //                             title='Go'
                      //                             onPress={() => this.navToLoc(name)}
                      //                         />
                      //                         <Button 
                      //                             title='Delete'
                      //                             onPress={(d) => context.removeLoc(name)}
                      //                         />
                      //                     </View>
                      //             </View>
                      //         )}))}
                      //     </ScrollView>
                      // </View>
                  )
        } else {
            return (
              <View style={styles.noFavsText} >
                <Title style={{padding: 5, textAlign: 'center', color: '#19996f'}}>No Favorites Saved!</Title>
                <MaterialCommunityIcons name="emoticon-sad-outline" size={75} color="#19996f" />
                <Fontisto 
                    style={styles.batteryIcon} 
                    name="battery-empty" 
                    size={350} 
                    color="#19996f" 
                />
              </View>
            )}
          }}
        </MapContext.Consumer>
        </ImageBackground>
      )}
  }

export default Favorites

 const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: '5%',
      justifyContent: 'center',
    },
    background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    },
    chargerName: {
      alignItems: 'center',
      backgroundColor: '#CCC',
      justifyContent: 'center',
      height: 70,
      borderRadius: 50
    },
    arrowLeft: {
      alignSelf: 'flex-end', 
      position: 'absolute'
    },
    noFavsText: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 550,
      paddingRight: 25
    },
    fix: {
      alignItems: 'center',
      backgroundColor: '#CCC',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      borderRadius: 50
    },
    buttonDelete: {
      padding: 20,
      paddingBottom: 55,
      paddingLeft: 13
      // backgroundColor: '#EB6262',
      // overflow: 'hidden',
      // borderRadius: 50
    },
    buttonGo: {
      paddingTop: 20,
      paddingBottom: 50,
      paddingRight: 25,
      paddingLeft: 25,
      backgroundColor: '#19996f',
      fontWeight: 'bold',
    },
    nameText: {
      paddingRight: 38, 
      paddingLeft: 38, 
      textAlign: 'center',
    },
    batteryIcon: {
      position: 'absolute', 
      alignSelf: 'center',
      bottom: -86
    }
 })