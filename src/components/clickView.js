import React, { Component } from 'react'
import { StyleSheet, View, Text, Linking } from 'react-native'
import { MapContext } from '../../context'
import { Title, Headline, Subheading, Button } from 'react-native-paper'
import { Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons'

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

    handleCall = () => {
        Linking.openURL(`tel:${this.props.address[5]}`)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.exitButton}>
                    <Title>Location Details</Title>
                    <Ionicons 
                        name="ios-close-circle" 
                        size={27} 
                        color="#EB6262"
                        onPress={this.props.overlayExit}
                        />
                </View>
                    <Headline style={styles.clickViewText}>
                        {this.props.address[4]}
                    </Headline>
                        <Subheading style={styles.clickViewText}>
                            <Entypo name="phone" size={17} color="gray" />  {this.props.address[5]}
                        </Subheading>
                        <Subheading style={styles.clickViewText}>
                            <Entypo name="location-pin" size={17} color="gray" />  {this.props.address[0]}
                        </Subheading>
                        <Subheading style={styles.clickViewText}>      {this.props.address[1]}, {this.props.address[2]}
                        </Subheading>
                        <Subheading style={styles.clickViewText}>      {this.props.address[3]}
                        </Subheading>
                        <Subheading style={styles.clickViewText}>
                            <FontAwesome5 name="car-side" size={14} color="gray" />  {this.props.distance}les
                        </Subheading>
                        <View><Text></Text></View>
                <View style={styles.buttonContainer}>
                    <Button
                        mode='contained'
                        color='#19996f'
                        onPress={this.handleCall}
                    >
                        CALL
                    </Button>
                    <Button
                        mode='contained'
                        color='#19996f'
                        onPress={this.handlePress}
                    >
                        NAVIGATE
                    </Button>
                    <MapContext.Consumer>{context =>
                        <Button
                            mode='contained'
                            color='#19996f'
                            onPress={(d) => context.saveLoc(this.props.address[4], `${this.props.desLat},${this.props.desLong}`)}
                        >
                            SAVE
                        </Button>}
                    </MapContext.Consumer>
                </View>
            </View>
        )
    }
}

export default CustomOverlayView

const styles = StyleSheet.create({
    container: {
        width: 300,
        padding: 10
    },
    clickViewText: {
        color: 'gray'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },    
      exitButton: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
      }
})