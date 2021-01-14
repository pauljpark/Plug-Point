import React, { Component } from 'react'
import MapView, { Polyline, Callout, Marker } from 'react-native-maps'
import { decode } from '@mapbox/polyline'
import { getRegion } from '../helpers/map'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import { Button, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Entypo } from '@expo/vector-icons'
import CustomOverlayView from './clickView'
import { Overlay } from 'react-native-elements'

export default class Map extends Component {
  constructor() {
    super()
      this.state = {
        myLatitude:null,
        myLongitude:null,
        desLatitude:null,
        desLongitude:null,
        coords: [],
        data: [],
        distance:'',
        visible: false,
        spinnerVisible: true,
        chargerInfo: []
    } 
  }

    //when the component mounts, we get user's location and fetch API data
    componentDidMount() {
        this.getLocation()
    }

    //ask permission to use my location 
    getLocation = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
    
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({});
    
          this.setState({
              myLatitude:location.coords.latitude,
              myLongitude:location.coords.longitude,
              spinnerVisible: false
          });
    
          this.map.animateToRegion(getRegion(location.coords.latitude, location.coords.longitude, 16000));
       } else { alert('We need your permission!') }

      //Charger data is fetched from API after location access is granted
      //locations are limited to 10 miles from user's location
       fetch(`https://api.openchargemap.io/v3/poi/?key=API-KEY-HERE&output=json&countrycode=US&latitude=${this.state.myLatitude}&longitude=${this.state.myLongitude}&distance=10&compact=true&verbose=false`)
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
    
    //when marker is pressed, the state of initial polycoords is updated
    //current pressed marker's info is also updated
    onPressMarker = (marker) => () => {
      this.setState({
        desLatitude: marker.AddressInfo.Latitude,
        desLongitude: marker.AddressInfo.Longitude,
        chargerInfo: [marker.AddressInfo.AddressLine1, 
                      marker.AddressInfo.Town,
                      marker.AddressInfo.StateOrProvince,
                      marker.AddressInfo.Postcode,
                      marker.AddressInfo.Title,
                      marker.AddressInfo.ContactTelephone1]
      }, this.routeCoords)
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
        const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startingLoc}&destination=${endingLoc}&key=API-KEY-HERE`)
        const respJson = await resp.json()
        const points = decode(respJson.routes[0].overview_polyline.points)
        const distance = respJson.routes[0].legs[0].distance.text
        const coords = points.map(point => {
          return {
            latitude: point[0],
            longitude: point[1]
          }
        })
        this.setState({
            coords: coords,
          distance: distance
        })
      } catch (error) {
        console.log('Error: ', error)
      }
    }

    //maps out all the markers on the mapview by mapping through data
    mapMarkers() {
      //when 'Click For Details' is pressed, the Overlay becomes visible
      onPressDetails = () => {
        this.setState({
          visible: true
        })
      }

      return this.state.data.map((marker, index) => (
        <Marker
            key={index}
            coordinate={{ latitude: marker.AddressInfo.Latitude, 
                          longitude: marker.AddressInfo.Longitude 
                        }} 
            onPress={this.onPressMarker(marker)}
        >
          <Callout>
            <View>
              <Text>{marker.AddressInfo.Title}</Text>
              <Text>Distance: {this.state.distance}</Text>
              <Button 
                  title='Click For Details'
                  onPress={() => onPressDetails()}
              />
            </View>
          </Callout>
        </Marker>
      ))}

    //simply exits the Overlay                    
    onBackDropPress = () => {
      this.setState({
        visible: false
      })
    }

    //will animate back to user's location when pressed
    animateBack = () => {
      this.map.animateToRegion(getRegion(this.state.myLatitude, this.state.myLongitude, 16000));
    }

    render() {
      if (this.state.spinnerVisible == true) {
        return (
            <View style={styles.spinner}>
                  <Text style={styles.text}>Please wait...</Text>
                  <ActivityIndicator 
                        size='large' 
                        color='#000000' 
                        animating={this.state.spinnerVisible}
                  />
            </View>
        )
      } else {
        return (
          //passing address and distance to CustomOverlayView so we can use them
                <>
                <MapView 
                    showsUserLocation
                    ref={(ref) => this.map = ref}
                    style={this.state.spinnerVisible ? styles.mapLoad : styles.map}
                    initialRegion={getRegion(39.9526, -75.1652, 160000)}
                >
                  {this.mapMarkers()}
                  <Polyline 
                    coordinates={this.state.coords}
                  />
                </MapView>
                    <View>
                      <Overlay
                          isVisible={this.state.visible}
                          onBackdropPress={this.onBackDropPress}
                      >
                        <CustomOverlayView 
                            address={this.state.chargerInfo}
                            distance={this.state.distance}
                            desLat={this.state.desLatitude}
                            desLong={this.state.desLongitude}
                            overlayExit={this.onBackDropPress}
                        />
                      </Overlay>
                    </View>
                    <View style={styles.button}>
                      <Entypo 
                        name="direction" 
                        size={40} 
                        color="black"
                        onPress={this.animateBack}
                      />
                    </View>
                </>
            )}
        }
    }

const styles = StyleSheet.create({
    mapLoad: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.5
    },
    map: {
      ...StyleSheet.absoluteFillObject
    },
    button: {
      position: 'absolute',
      top: '7%',
      right: '7%',
      alignSelf: 'flex-end'
    },
    spinner: {
      position: 'absolute',
      flex: 1,
      alignSelf: 'center',
      marginTop: '100%'
    },
    text: {
      bottom: '5%'
    }
});
