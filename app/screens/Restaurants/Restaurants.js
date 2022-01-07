import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import {firebaseApp} from '../../utils/firebase';
import { getAuth} from 'firebase/auth';
import { getFirestore, getDocs, collection, query} from 'firebase/firestore';
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const Restaurants = ({navigation}) => {
    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [totalRestaurants, setTotalRestaurants] = useState(0);

    useEffect(() => {
        auth.onAuthStateChanged((userInfo)=>{
            setUser(userInfo);
        });
    }, []);

    useEffect(() => {

        (async ()=>{
            const q = query(collection(db, "restaurants"));
            const querySnapshot = await getDocs(q);
            let rest = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                rest.push({
                    id:doc.id,
                    ...doc.data()
                })
            });
            setTotalRestaurants(rest.length);
            setRestaurants(rest);
        })()
    }, [])

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