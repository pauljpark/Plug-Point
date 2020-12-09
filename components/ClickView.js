import React, { Component } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'

export default class CustomOverlayView extends Component {

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
                />
                <Button 
                    title='Exit'
                />
            </View>
        )
    }
}

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