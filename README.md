# PlugPoint

A full-stack mobile application that locates electric vehicle chargers near you. Built on React Native, MongoDB, Node, Express.

This project pulls EV charger data from the Open Charge Map API and populates them on a map for the user to view details on, navigate to, and save.

## Create an account: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Locate and save an EV station: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

<img src="https://media.giphy.com/media/KTk2vmdU5l45rNSnR3/giphy.gif" width=277 /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <img src="https://media.giphy.com/media/2jEV8ngw0ytSPp5oxa/giphy.gif" width=277 /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 

## Navigate to or delete saved locations:

<img src="https://media.giphy.com/media/lCgfHqbZlVmQMm4RtO/giphy.gif" width=277 />

### Installation and Setup Instructions

Clone this repository. Node and npm must be installed globally on your machine

In the main project directory, run:

### `npm install`

### `expo start`

Runs the app in the Expo development framework. To run the app on your mobile device, download the Expo Go app and scan the QR code from the Metro Bundler. To run via iOS simulator, follow the Instructions to download here: https://docs.expo.io/workflow/ios-simulator/ 

Then `cd backend` and run:

### `npm install`

### `npm start`

Runs the server in the backend

To obtain a connection string, please follow the instructions here: https://gist.github.com/singhayushh/426f10353a8051593828e92c139ebdbc

In the backend directory, create a .env file with your new connection string (connects to your MongoDB database):

```
ATLAS_URI=YOUR_NEW_CONNECTION_STRING
```
