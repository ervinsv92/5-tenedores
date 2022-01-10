import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import {firebaseApp} from '../../utils/firebase';
import { getAuth} from 'firebase/auth';
import { getFirestore, getDocs, collection, query, orderBy, limit, startAfter} from 'firebase/firestore';
import ListRestaurants from '../../components/Restaurants/ListRestaurants';
import { useFocusEffect } from '@react-navigation/native';
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const Restaurants = ({navigation}) => {
    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [startRestaurant, setStartRestaurant] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const LIMIT_RESTAURANTS = 7;

    useEffect(() => {
        auth.onAuthStateChanged((userInfo)=>{
            setUser(userInfo);
        });
    }, []);

    //Se ejecuta cuando se le hace focus a la pantalla
    useFocusEffect(
        useCallback(
            () => {
                (async ()=>{
                    const q = query(collection(db, "restaurants"), orderBy('createAt'), limit(LIMIT_RESTAURANTS));
                    const querySnapshot = await getDocs(q);
                    let rest = [];
                    querySnapshot.forEach((doc) => {
                        rest.push({
                            id:doc.id,
                            ...doc.data()
                        })
                    });
                    setTotalRestaurants(rest.length);
                    setRestaurants(rest);
                    setStartRestaurant(rest[rest.length-1]);
                    console.log("total restaurants: ", totalRestaurants)
                    console.log("start rest: ", startRestaurant)
                })()
            },
            [],
        )
    );

    const handleLoadMore = async ()=>{
        restaurants.length < totalRestaurants && setLoading(true);

        const q = query(collection(db, "restaurants"), orderBy('createAt'), startAfter(startRestaurant.createAt), limit(LIMIT_RESTAURANTS));
        const querySnapshot = await getDocs(q);
        let rest = [];
        querySnapshot.forEach((doc) => {
            rest.push({
                id:doc.id,
                ...doc.data()
            })
        });

        if(rest.length > 0){
            setStartRestaurant(rest[rest.length-1]);
        }else{
            setIsLoading(false);
        }
        setRestaurants([...restaurants, ...rest]);
    }

    return (
        <View style={styles.viewBody}>
            <ListRestaurants restaurants={restaurants} handleLoadMore={handleLoadMore} isLoading={isLoading}/>
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