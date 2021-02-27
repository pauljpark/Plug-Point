## PlugPoint

A full-stack mobile application that locates EV chargers near you; built on React Native, MongoDB, Node, Express

This project pulls EV charger data from the Open Charge Map API and displays them for the user to view details on, navigate to, and save

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

In the server directory, create a .env file with your new connection string (connects to your MongoDB database):

```
ATLAS_URI=YOUR_NEW_CONNECTION_STRING
```