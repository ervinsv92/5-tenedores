import React, { useEffect, useState, useCallback, useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import { getFirestore, getDoc, doc, addDoc, collection, where, query, getDocs, deleteDoc} from 'firebase/firestore';
import {firebaseApp} from '../../utils/firebase';
import { getAuth} from 'firebase/auth';
import {Loading} from '../../components/Loading';
import CarouselImages from '../../components/Carousel';
import { Icon, ListItem, Rating } from 'react-native-elements';
import Map from '../../components/Map';
import ListReviews from '../../components/Restaurants/ListReviews';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import { querystring } from '@firebase/util';

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const screenWidth= Dimensions.get("window").width;

const Restaurant = ({navigation, route}) => {
    const {id, name} = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();

    auth.onAuthStateChanged((user)=>{
        user ? setUserLogged(true):setUserLogged(false)
    });

    navigation.setOptions({title:name});

    useFocusEffect(
        useCallback(() => {
            (async ()=>{
                try {
                    const docRef = doc(db, "restaurants", id);
                    const docSnap = await getDoc(docRef);
    
                    if(docSnap.exists()){
                        const data = docSnap.data();
                        data.id = id;
                        setRestaurant(data);
                        setRating(data.rating);
                    }    
                } catch (error) {
                    console.log(error)
                }
                
            })()
        }, [])
    );

    useEffect(() => {
        if(userLogged && restaurant){
            (async ()=>{
                try {
                    const q = query(collection(db, "favorites"), where('idRestaurant', '==', restaurant.id),  where('idUser', '==', auth.currentUser.uid));
                    const querySnapshot = await getDocs(q);
                    if(querySnapshot.empty){
                        setIsFavorite(false);
                    }else{
                        setIsFavorite(true);
                    }   
                } catch (error) {
                    console.log("EEEError: ", error)    
                }
            })() 
        }
    }, [userLogged, restaurant]);
    
    
    const addFavorite = async ()=>{
        if(!userLogged){
            toastRef.current.show("Para usar el sistema de favoritos, tienes que estar logueado")
            return;
        }

        const payload = {
            idUser:auth.currentUser.uid,
            idRestaurant:restaurant.id
        }

        try {
            const docRef = await addDoc(collection(db, 'favorites'), payload);
            setIsFavorite(true);
            toastRef.current.show("Restaurante añadido a favoritos.")
            console.log("registrado")
        } catch (error) {
            toastRef.current.show("Error al añadir el restaurante a favoritos")
            console.log(error)
        }
    }

    const removeFavorite = async ()=>{
        try {
            const q = query(collection(db, "favorites"), where('idRestaurant', '==', restaurant.id),  where('idUser', '==', auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            if(!querySnapshot.empty){
                querySnapshot.forEach(async (favorite)=>{
                    await deleteDoc(doc(db, "favorites", favorite.id));
                    setIsFavorite(false)
                })
            }   
            toastRef.current.show("Restaurante quitado de favoritos")
        } catch (error) {
            toastRef.current.show("Error al quitar el restaurante de favoritos")
            console.log("Error: ", error)
        }
    }

   if (!restaurant) {
    return <Loading isVisible={true} text="Cargando..." />;
   }

    return (
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFavorite}>
                <Icon 
                    type="material-community"
                    name={isFavorite? "heart":"heart-outline"}
                    onPress={isFavorite?removeFavorite:addFavorite}
                    color={isFavorite? "#f00":"#000"}
                    size={35}
                    underlayColor="transparent"
                />
            </View>
            <CarouselImages 
                arrayImages={restaurant.images}
                height={250}
                width={screenWidth}
            />
            <TitleRestaurant name={name} description={restaurant.description} rating={rating}/>
            <RestaurantInfo location={restaurant.location} name={name} address={restaurant.address} />
            <ListReviews navigation={navigation} idRestaurant={restaurant.id} />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            
        </ScrollView>
    )
}

export default Restaurant

const TitleRestaurant = ({name, description, rating})=>{

    return <View style={styles.viewRestaurantTitle} >
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.nameRestaurant}>{name}</Text>
                    <Rating 
                        style={styles.rating}
                        imageSize={20}
                        readonly
                        startingValue={parseFloat(rating)}
                    />
                </View>
                <Text style={styles.descriptionRestaurant}>{description}</Text>
            </View>
}

const RestaurantInfo = ({location, name, address})=>{

    const listInfo = [
        {
            text:address,
            iconName:'map-marker',
            iconType:'material-community',
            action:null
        },
        {
            text:"54545454",
            iconName:'phone',
            iconType:'material-community',
            action:null
        },
        {
            text:"correo@gmail.com",
            iconName:'at',
            iconType:'material-community',
            action:null
        }
    ];

    return <View style={styles.viewRestaurantInfo} >
                <Text style={styles.restaurantInfoTitle}>Información sobre el restaurante</Text>
                <Map 
                    location={location}
                    name={name}
                    height={100}
                />

                {
                    listInfo.map((info, index)=>(
                        <ListItem 
                            key={index}
                            title={info.text}
                            leftIcon={{
                                name:info.iconName,
                                type:info.iconType,
                                color:'#00a680'
                            }}
                            containerStyle={styles.containerListItem}
                        />
                    ))
                }
           </View>
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor:"#fff"
    },
    viewRestaurantTitle:{
        padding:15
    },
    nameRestaurant:{
        fontSize:20,
        fontWeight:'bold'
    },
    descriptionRestaurant:{
        marginTop:5,
        color:'grey'
    },
    rating:{
        position:'absolute',
        right:0
    },
    viewRestaurantInfo:{
        margin:15,
        marginTop:25
    },
    restaurantInfoTitle:{
        fontSize:20,
        fontWeight:'bold',
        marginBottom:10
    },
    containerListItem:{
        borderBottomColor:'#d8d8d8',
        borderBottomWidth:1
    },
    viewFavorite:{
        position:'absolute',
        top:0,
        right:0,
        zIndex:2,
        backgroundColor:"#fff",
        borderBottomLeftRadius:100,
        padding:5,
        paddingLeft:15
    }
})
