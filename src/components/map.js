import React, { Component } from 'react'
import MapView, { Polyline, Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { decode } from '@mapbox/polyline'
import { getRegion } from '../helpers/map'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import { StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import CustomOverlayView from './clickView'
import { Overlay } from 'react-native-elements'
import { Subheading, Caption, Paragraph, Headline } from 'react-native-paper'

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
        chargerInfo: [],
        permissionLoc: true
    } 
  }

    //when the component mounts, we get user's location and fetch API data
    componentDidMount() {
        this.getLocation()
    }

    //ask permission to use my location 
    getLocation = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION)
    
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({})
    
          this.setState({
              myLatitude:location.coords.latitude,
              myLongitude:location.coords.longitude,
              spinnerVisible: false
          })
              
          //Charger data is fetched from API after location access is granted
          //locations are limited to 10 miles from user's location
          fetch(`https://api.openchargemap.io/v3/poi/?key=${process.env.CHARGER_KEY}&output=json&countrycode=US&latitude=${this.state.myLatitude}&longitude=${this.state.myLongitude}&distance=10&compact=true&verbose=false`)
          .then(response => response.json())
          .then((resp) => {
              this.setState({
                data: resp
              })
            })
            .catch((error) => {
              console.log('Error', error)
            })

          this.map.animateToRegion(getRegion(this.state.myLatitude, this.state.myLongitude, 16000))

        } else { 
            this.setState({ permissionLoc: false })
        }
    }
    
    //when marker is pressed, the state of initial polycoords is updated
    //current pressed marker's info is also updated
    onPressMarker = (marker) => () => {
      this.map.animateCamera({ 
        center: {
          latitude: marker.AddressInfo.Latitude, 
          longitude: marker.AddressInfo.Longitude 
        }})
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
          <Image 
              source={require('../../public/e-bike-charging.png')}
          />
          {//callout button doesn't work when using custom google maps, 
          //temp solution for callout onPress...
                      }
          <Callout 
              style={styles.callout}
              onPress={() => onPressDetails()}>
            <View style={styles.calloutStyle}>
              <Subheading style={{ textAlign: 'center' }}>{marker.AddressInfo.Title}</Subheading>
                <View style={{display:'flex', flexDirection: 'row'}}>
                  <MaterialCommunityIcons name='car-hatchback' size={24} />
                  <Paragraph>  {this.state.distance}</Paragraph>
                </View>
              <Caption>Tap for Details</Caption>
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
      this.map.animateToRegion(getRegion(this.state.myLatitude, this.state.myLongitude, 16000))
      // this.map.animateCamera({ 
      //   center: {
      //     latitude: this.state.myLatitude, 
      //     longitude: this.state.myLongitude 
      //   }})
    }

    render() {
        return (
          //passing address and distance to CustomOverlayView so we can use them
                <>
                <View style={styles.spinner}>
                  <Headline style={styles.text}>{
                        this.state.permissionLoc ? 
                          "Finding chargers near you..." : 
                          "Permission to access location was denied!"}
                  </Headline>
                  <ActivityIndicator 
                        size='large' 
                        color={this.state.permissionLoc ? '#000000' : '#ffffff00'} 
                        animating={this.state.spinnerVisible}
                  />
                </View>
                <MapView 
                    showsUserLocation={this.state.spinnerVisible ? false : true}
                    ref={(ref) => this.map = ref}
                    style={this.state.spinnerVisible ? styles.mapLoad : styles.map}
                    initialRegion={getRegion(37.0902, -95.7129, 1600000)}
                    customMapStyle={mapStyle}
                    provider={PROVIDER_GOOGLE}
                    rotateEnabled={false}
                    onMapReady={this.getLocation}
                    zoomEnabled={this.state.spinnerVisible ? false : true}
                    scrollEnabled={this.state.spinnerVisible ? false : true}
                    minZoomLevel={5}
                >
                  {this.mapMarkers()}
                  <Polyline 
                    coordinates={this.state.coords}
                    strokeWidth={4}
                    strokeColors={['#3394fd', '#19996f']}
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
                    <View style={this.state.spinnerVisible ? {display: 'none'} : styles.button}>
                      <MaterialIcons 
                        name="center-focus-strong" 
                        size={40} 
                        color="#3394fd"
                        onPress={this.animateBack}
                      />
                    </View>
                </>
            )}
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
      top: '9%',
      right: '9%',
      alignSelf: 'flex-end'
    },
    spinner: {
      position: 'absolute',
      flex: 1,
      alignSelf: 'center',
      marginTop: '95%'
    },
    text: {
      bottom: '10%',
      textAlign: 'center',
      paddingLeft: 70,
      paddingRight: 70
    },
    callout: {
      flex: 1, 
      position: 'relative',
      width: 150
    },
    calloutStyle: {
        alignItems: 'center',
        marginTop: -6, 
        marginRight: -11, 
        marginBottom: -4, 
        marginLeft: -7, 
        padding: 10
    }
});

var mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
]