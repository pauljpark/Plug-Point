import React, { Component } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'

export default class CustomCalloutView extends Component {

    onPressDetails() {
        return (
                <View>
                    <Text>text here</Text>
                </View>
        )
    }


    render() {
        return (
            <View>
                <Text style={styles.ClickViewText}>
                    {this.props.title}
                </Text>
                <Button 
                    onPress={this.onPressDetails}
                    title='Click for details'
                    color= '#aacf61'
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ClickViewText: {
        color: 'red'
    }
})