import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import {Overlay} from "react-native-elements";

export const Loading = ({isVisible, text}) => {
    return (
        <Overlay>
            <View>
                <ActivityIndicator size="large" color="#00a680" />
                {text && <Text>{text}</Text>}
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay:{
        
    }
});