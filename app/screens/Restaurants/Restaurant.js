import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getFirestore, getDoc, doc} from 'firebase/firestore';
import {firebaseApp} from '../../utils/firebase';
import {Loading} from '../../components/Loading';
const db = getFirestore(firebaseApp);

const Restaurant = ({navigation, route}) => {
    const {id, name} = route.params;
    const [restaurant, setRestaurant] = useState(null);
    navigation.setOptions({title:name});

    useEffect(() => {
        (async ()=>{
            try {
                const docRef = doc(db, "restaurants", id);
                const docSnap = await getDoc(docRef);

                if(docSnap.exists()){
                    const data = docSnap.data();
                    data.id = id;
                    setRestaurant(data)
                }    
            } catch (error) {
                console.log(error)
            }
            
        })()
    }, []);

   if (!restaurant) {
    return <Loading isVisible={true} text="Cargando..." />;
   }

    return (
        <View>

            <Text>{restaurant?.name || 'info...'}</Text>
        </View>
    )
}

export default Restaurant

const styles = StyleSheet.create({})
