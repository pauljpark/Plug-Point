import React, { Component } from 'react'
import MapView, { Callout, Marker } from 'react-native-maps'
import { decode } from '@mapbox/polyline'
import { getRegion } from './src/helpers/map'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import { TextInput, TouchableOpacity, ToastAndroid, StatusBar, Button, StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import CustomCalloutView from './components/ClickView'

export default class App extends Component {
  constructor() {
    super()
      this.state = {
        myLatitude:null,
        myLongitude:null,
        desLatitude:null,
        desLongitude:null,
        coords: [],
        data: []
    } 
  }

    //when the component mounts, we get out location 
    //and the data is fetched from our API
    componentDidMount() {
        this.getLocation()
        fetch('https://api.openchargemap.io/v3/poi/?key=API-KEY-GOES-HERE&output=json&countrycode=SPAIN&maxresults=3000&compact=true&verbose=false')
        .then(response => response.json())
        .then((resp) => {
          this.setState({
            data: resp
          })
        })
        .catch((error) => {
          console.log('Error', error)
        })
    }

    //ask premission to use my location 
    getLocation = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
    
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({});
    
          this.setState({
              myLatitude:location.coords.latitude,
              myLongitude:location.coords.longitude
          });
    
          this.map.animateToRegion(getRegion(location.coords.latitude, location.coords.longitude, 16000));
       }
    }
    
    //deconstruct state and when not null, pass Start and End parameters
    //to this.fetchRoute()
    routeCoords = () => {
      const {
        myLatitude,
        myLongitude,
        desLatitude,
        desLongitude
      } = this.state

      const StartAndEnd = myLatitude !== null && desLatitude !== null
      
      if (StartAndEnd) {
        const Start = `${myLatitude},${myLongitude}`
        const End = `${desLatitude},${desLongitude}`
        this.fetchRoute(Start, End)
      }

    }


    //fetch coordinates of startingLoc and endingLoc from google maps API
    //decode the response and set the mapped points to setState
    async fetchRoute(startingLoc, endingLoc) {
      try {
        const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startingLoc}&destination=${endingLoc}&key=API-KEY-GOES-HERE`)
        const respJson = await resp.json()
        const points = decode(respJson.routes[0].overview_polyline.points)
        const coords = points.map(point => {
          return {
            latitude: point[0],
            longitude: point[1]
          }
        })
        this.setState({
            coords: coords
        })
      } catch (error) {
        console.log('Error: ', error)
      }
    }
  
    //when marker is pressed, the state of initial polycoords is updated
    onPressMarker = (marker) => () => {
      this.setState({
        desLatitude: marker.AddressInfo.Latitude,
        desLongitude: marker.AddressInfo.Longitude
     }, this.routeCoords)
    }

    //maps out all the markers on the mapview by mapping through data
    //CustomCalloutView is everything in the bubble above marker when pressed
    //passing title and address to CustomCalloutView so we can use them
    mapMarkers() {
      return this.state.data.map((marker, index) => (
        <Marker
            key={index}
            coordinate={{ latitude: marker.AddressInfo.Latitude, 
                          longitude: marker.AddressInfo.Longitude 
                        }} 
            onPress={this.onPressMarker(marker)}
        >
          <Callout>
            <CustomCalloutView 
              title={marker.AddressInfo.Title}
              address={marker.AddressInfo.AddressLine1}
            />
          </Callout>
        </Marker>))
    }

    //render the Polyline only when polycoords state is not null
    renderPoly() {
      if (this.state.desLatitude !== null) {
        return (
          <MapView.Polyline 
                coordinates={ this.state.coords } 
            />
        )
      }
    }


    render() {
        return (
                <MapView 
                    showsUserLocation
                    ref={(ref) => this.map = ref}
                    style={styles.map}
                    initialRegion={getRegion(41.3851, 2.1734, 160000)}
                >
                  {this.mapMarkers()}
                  {this.renderPoly()}
                </MapView>
            )
        }
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    inputWrapper: {
        width: '100%',
        position: 'absolute',
        padding: 10,
        top: 44,
        left: 0,
        zIndex: 100
      },
      input: {
        height: 46,
        paddingVertical: 10,
        paddingRight: 50,
        paddingLeft: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 6,
        borderColor: '#ccc',
        backgroundColor: '#fff'
      },
      sendButton: {
        position: 'absolute',
        top: 17,
        right: 20,
        opacity: 0.4
      },
      sendButtonActive: {
        opacity: 1
      }
    });