import React, {useState, useRef, useCallback} from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import {Image, Icon, Botton, Button} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {firebaseApp} from '../utils/firebase';
import { getAuth} from 'firebase/auth';
import { getFirestore, getDocs, collection, query, where, doc, getDoc, orderBy, limit, startAfter} from 'firebase/firestore';
import Loading from '../components/Loading';

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const Favorites = ({navigation}) => {

    const [restaurants, setRestaurants] = useState([]);
    const [userLogged, setUserLogged] = useState(false);

    auth.onAuthStateChanged((user)=>{
        user ? setUserLogged(true):setUserLogged(false)
    });

    //Se ejecuta cuando se le hace focus a la pantalla
    useFocusEffect(
        useCallback(
            () => {
                console.log("Inicio callback")
                if(userLogged){
                    const idUser = auth.currentUser.uid;
                    (async ()=>{

                        const q = query(collection(db, "favorites"), where("idUser", "==", idUser));
                        const querySnapshot = await getDocs(q);
                        let idRestaurants = [];
                        querySnapshot.forEach((item) => {
                            const dataFav = item.data()
                            idRestaurants.push(dataFav.idRestaurant)
                        });

                        console.log("id favorites: ", idRestaurants)
                        const res = await getRestaurants(idRestaurants);
                        setRestaurants(res)
                        console.log("favorites: ", restaurants)
                        //setTotalRestaurants(rest.length);
                        //setRestaurants(rest);
                        //setStartRestaurant(rest[rest.length-1]);
                        //console.log("total restaurants: ", totalRestaurants)
                        //console.log("start rest: ", startRestaurant)
                    })()
                }
            },
            [userLogged],
        )
    );

    const getRestaurants = async (idRestaurants)=>{
        let restaurants = [];

        for(let id of idRestaurants){
            try {
                console.log("Doc id: ", id)
                const docRef = doc(db, "restaurants", id);
                const docSnap = await getDoc(docRef);
    
                if(docSnap.exists()){
                    const data = docSnap.data();
                    console.log("Data: ", data)
                    data.id = id;
                    restaurants.push(data)
                }    
            } catch (error) {
                console.log(error)
            }
        }

        return restaurants
    }

    if(!userLogged){
        return <UserNoLogged navigation={navigation}/>
    }

    if(!restaurants){
        return <Loading isVisible={true} text="Cargando restaurantes"/>
    }else if(restaurants.length === 0){
        return <NotFoundRestaurants />
    }

    return (
        <View>
            <Text>Favorites</Text>
        </View>
    )
}


const NotFoundRestaurants = ()=>{
    return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Icon type='material-community' name='alert-outline' size={50}/>
            <Text style={{fontSize:20, fontWeight:'bold'}}>No tienes restaurantes en tu lista</Text>
        </View>
    )
}

const UserNoLogged = ({navigation})=>{
    return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Icon type='material-community' name='alert-outline' size={50}/>
            <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center'}}>Necesitas estar logeado para ver esta sección</Text>
            <Button 
                title="Ir al login"
                containerStyle={{marginTop:20,width:'80%'}}
                buttonStyle={{backgroundColor:'#00a680'}}
                onPress={()=>navigation.navigate("account", {screen:"login"})}
            />
        </View>
    )
}