import React, {useState, useRef, useCallback} from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import {Image, Icon, Botton, Button} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {firebaseApp} from '../utils/firebase';
import { getAuth} from 'firebase/auth';
import { getFirestore, getDocs, collection, query, where, doc, getDoc, orderBy, limit, startAfter} from 'firebase/firestore';
import Loading from '../components/Loading';
import Toast from 'react-native-easy-toast';

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const Favorites = ({navigation}) => {

    const [restaurants, setRestaurants] = useState([]);
    const [userLogged, setUserLogged] = useState(false);
    const tostRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [reloadData, setReloadData] = useState(false)

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
                        //console.log("favorites: ", restaurants)
                        //setTotalRestaurants(rest.length);
                        //setRestaurants(rest);
                        //setStartRestaurant(rest[rest.length-1]);
                        //console.log("total restaurants: ", totalRestaurants)
                        //console.log("start rest: ", startRestaurant)
                    })()
                }
                setReloadData(false)
            },
            [userLogged, reloadData],
        )
    );

    const getRestaurants = async (idRestaurants)=>{
        let listRestaurants= [];

        for(let id of idRestaurants){
            try {
                console.log("Doc id: ", id)
                const docRef = doc(db, "restaurants", id);
                const docSnap = await getDoc(docRef);
    
                if(docSnap.exists()){
                    const data = docSnap.data();
                    console.log("Data: ", data)
                    data.id = id;
                    listRestaurants.push(data)
                }    
            } catch (error) {
                console.log(error)
            }
        }

        return listRestaurants
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
        <View style={styles.viewBody}>
            {
                restaurants ? (
                    <FlatList 
                        data={restaurants}
                        renderItem={(restaurant)=><Restaurant restaurant={restaurant} setIsLoading={setIsLoading} toastRef={toastRef} setReloadData={setReloadData}/>}
                        keyExtractor={(item, index)=> index.toString()}
                    />
                ):
                (
                    <View style={styles.loaderRestaurants}>
                        <ActivityIndicator size='large'/>
                        <Text style={{textAlign:'center'}}>Cargando restaurantes</Text>
                    </View>
                )
            }

            <Toast ref={tostRef} position='center' opacity={0.9}/>
            <Loading text="Eliminando restaurante" isVisible={isLoading}/>
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

const Restaurant = ({restaurant, setIsLoading, toastRef, setReloadData})=>{
    const {id, name, images} = restaurant.item;
    console.log("ID: ", id)

    const confirmRemoveFavorite = ()=>{
        Alert.alert(
            "Eliminar restaurante de favoritos",
            "¿Estas seguro que quieres eliminar el restaurante de favoritos?",
            [
                {
                    text:'Cancel',
                    style:'cancel'
                },
                {
                    text:'Eliminar',
                    onPress:{removeFavorite}
                }
            ],
            {
                cancelable:false
            }
        )
    }

    const removeFavorite = async ()=>{
        setIsLoading(true)
        try {
            const q = query(collection(db, "favorites"), where('idRestaurant', '==', id),  where('idUser', '==', auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            if(!querySnapshot.empty){
                querySnapshot.forEach(async (favoriteDel)=>{
                    await deleteDoc(doc(db, "favorites", favoriteDel.id));
                })
            }   
            setIsLoading(false)
            toastRef.current.show("Restaurante quitado de favoritos")
            setReloadData(true);
        } catch (error) {
            setIsLoading(false)
            toastRef.current.show("Error al quitar el restaurante de favoritos")
            console.log("Error: ", error)
        }
    }

    return (
        <View style={styles.restaurant}>
            <TouchableOpacity
                onPress={()=>console.log("IR")}
            >
                <Image 
                    resizeMode='cover'
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator color="#fff"/>}
                    source={
                        images[0]?
                        {uri:images[0]}:
                        require('../../assets/img/no-image.png')
                    }
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Icon 
                        type='material-community'
                        name='heart'
                        color='#f00'
                        containerStyle={styles.favorite}
                        onPress={confirmRemoveFavorite}
                        underlayColor='transparent'
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor:'#f2f2f2'
    },
    loaderRestaurants:{
        marginTop:10,
        marginBottom:10
    },
    restaurant:{
        margin:10
    },
    image:{
        width:'100%',
        height:180
    },
    info:{
        flex:1,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:"row",
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:10,
        marginTop:-30,
        backgroundColor:"#fff"
    },
    name:{
        fontWeight:'bold',
        fontSize:30
    },
    favorite:{
        marginTop:-35,
        backgroundColor:'#fff',
        padding:15,
        borderRadius:100
    }
});