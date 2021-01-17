import React, { Component } from 'react'
import { StyleSheet, View, Text, Button, Linking, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MapContext from '../../context'

class CustomOverlayView extends Component { 

    //when user presses "Navigate", app will check for google maps first,
    //if not installed, will open with apple maps
    handlePress = () => {
        Linking.canOpenURL("comgooglemaps")
        .then((canOpen) => {
            console.log(canOpen)
            if (canOpen) { 
                Linking.openURL(`comgooglemaps://?daddr=${this.props.desLat.toString()},${this.props.desLong.toString()}&directionsmode=driving`) 
            } else { 
                Linking.openURL(`http://maps.apple.com/?daddr=${this.props.desLat.toString()},${this.props.desLong.toString()}`) 
            }
        })
    }

    //saves the location to async storage
    // async saveLoc() {
    //     try {
    //         await AsyncStorage.setItem(this.props.address[4], `${this.props.desLat},${this.props.desLong}`)
    //     } catch (error) {
    //         console.log('Error:', error)
    //     }
    //     Alert.alert('Saved to Favorites!')
    // }

    render() {
        return (
            <View>
                <Text style={styles.clickViewText}>
                    {this.props.address[4]}
                </Text>
                <Text style={styles.clickViewText}>
                    Business Hours: {this.props.address[5]}
                </Text>
                <Text style={styles.clickViewText}>
                    {this.props.address[0]}
                </Text>
                <Text style={styles.clickViewText}>
                    {this.props.address[1]}
                </Text>
                <Text style={styles.clickViewText}>
                    {this.props.address[2]}
                </Text>
                <Text style={styles.clickViewText}>
                    {this.props.address[3]}
                </Text>
                <Text style={styles.clickViewText}>
                    {this.props.distance} away
                </Text>
                <Button 
                    title='Navigate'
                    onPress={this.handlePress}
                />
                <MapContext.Consumer>{context =>
                    <Button 
                        title='Save'
                        onPress={(d) => context.saveLoc(this.props.address[4], `${this.props.desLat},${this.props.desLong}`)}
                    />}
                </MapContext.Consumer>
                <Button 
                    title='Exit'
                    onPress={this.props.overlayExit}
                />
            </View>
        )
    }
}

export default CustomOverlayView

const styles = StyleSheet.create({
    clickViewText: {
        color: 'red'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      }
})