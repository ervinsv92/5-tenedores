import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import { getFirestore, getDoc, doc} from 'firebase/firestore';
import {firebaseApp} from '../../utils/firebase';
import {Loading} from '../../components/Loading';
import CarouselImages from '../../components/Carousel';
import { ListItem, Rating } from 'react-native-elements';
import Map from '../../components/Map';
import ListReviews from '../../components/Restaurants/ListReviews';
import { useFocusEffect } from '@react-navigation/native';

const db = getFirestore(firebaseApp);
const screenWidth= Dimensions.get("window").width;

const Restaurant = ({navigation, route}) => {
    const {id, name} = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);
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
    

   if (!restaurant) {
    return <Loading isVisible={true} text="Cargando..." />;
   }

    return (
        <ScrollView vertical style={styles.viewBody}>
            <CarouselImages 
                arrayImages={restaurant.images}
                height={250}
                width={screenWidth}
            />
            <TitleRestaurant name={name} description={restaurant.description} rating={rating}/>
            <RestaurantInfo location={restaurant.location} name={name} address={restaurant.address} />
            <ListReviews navigation={navigation} idRestaurant={restaurant.id} setRating={setRating} />
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
    }
})
