import React, { Component } from 'react'
import MapView, { Polyline, Callout, Marker } from 'react-native-maps'
import { decode } from '@mapbox/polyline'
import { getRegion } from './src/helpers/map'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import { TextInput, TouchableOpacity, Button, StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import CustomOverlayView from './components/ClickView'
import { Overlay } from 'react-native-elements'

export default class App extends Component {
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
        chargerInfo: []
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

    //ask permission to use my location 
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
        const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startingLoc}&destination=${endingLoc}&key=API-KEY-GOES-HERE`)
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


    onBackDropPress = () => {
      this.setState({
        visible: false
      })
    }

    render() {

        return (
          //passing address and distance to CustomOverlayView so we can use them
                <>
                <MapView 
                    showsUserLocation
                    ref={(ref) => this.map = ref}
                    style={styles.map}
                    initialRegion={getRegion(41.3851, 2.1734, 160000)}
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
                        />
                      </Overlay>
                    </View>
                </>
            )
        }
    }

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    }
});