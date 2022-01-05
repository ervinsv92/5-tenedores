import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import {firebaseApp} from '../../utils/firebase';
import { getAuth} from 'firebase/auth';
import { launchImageLibraryAsync } from 'expo-image-picker';
const auth = getAuth(firebaseApp);

export const Restaurants = ({navigation}) => {

    const [user, setUser] = useState(null);


    useEffect(() => {
        auth.onAuthStateChanged((userInfo)=>{
            setUser(userInfo);
        });
    }, []);

    return (
        <View style={styles.viewBody}>
            <Text>Restaurants</Text>

            {
                user && 
                <Icon 
                    reverse
                    type='material-community'
                    name='plus'
                    color='#00a680'
                    containerStyle={styles.btnContainer}
                    onPress={()=> navigation.navigate('add-restaurant')}
                />
            }

            
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor:'#fff'
    },
    btnContainer:{
        position:'absolute',
        bottom:10,
        right:10,
        shadowColor:'black',
        shadowOffset:{width:2, height:2},
        shadowOpacity:0.5
    }
});