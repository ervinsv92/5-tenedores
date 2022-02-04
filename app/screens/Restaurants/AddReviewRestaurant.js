import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AirbnbRating, Button, Input } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import {firebaseApp} from '../../utils/firebase';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth  } from "firebase/auth";
import { Loading } from '../../components/Loading';
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const AddReviewRestaurant = ({navigation, route}) => {
    const {idRestaurant} = route.params;
    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();

    const addReview = ()=>{
        if(!rating){
            toastRef.current.show("No has dado ninguna puntuación")
            return;
        }else if(!title){
            toastRef.current.show("El título es obligatorio")
            return;
        }else if(!review){
            toastRef.current.show("El comentario es obligatorio")
            return;
        }

        setIsLoading(true);
        const user = auth.currentUser;
        const payload = {
            idUser: user.uid,
            avatarUser:user.photoURL,
            idRestaurant,
            title,
            review,
            rating,
            createAt:new Date()
        }
        try {
            const docRef = addDoc(collection(db,'reviews'), payload);
            if(docRef){
                
            }else{

            }
            setIsLoading(false);
        } catch (error) {
            console.log(error)   
            toastRef.current.show("Error al enviar la review")
        }
    }

    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating 
                    count={5} 
                    reviews={["Pésimo", "Deficiente", "Normal", "Muy bueno", "Excelente"]}
                    defaultRating={0}
                    size={35}
                    onFinishRating={(value)=> setRating(value)}
                />
            </View>
            <View style={styles.formReview}>
                <Input 
                    placeholder='Título'
                    containerStyle={styles.input}
                    onChange={(e)=> setTitle(e.nativeEvent.text)}
                />
                <Input 
                    placeholder='Comentario'
                    multiline={true}
                    inputContainerStyle={styles.textArea}
                    onChange={(e)=> setReview(e.nativeEvent.text)}
                />
                <Button 
                    title='Enviar Comentario'
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={addReview}
                />
            </View>
            <Toast ref={toastRef} position='center' opacity={0.9} />
            <Loading isVisible={isLoading} text="Enviando comentario"/>
        </View>
    );
};

const styles = StyleSheet.create({
    viewBody:{
        flex:1
    },
    viewRating:{
        height:110,
        backgroundColor:"#f2f2f2"
    },
    formReview:{
        flex:1,
        alignItems:'center',
        margin:10,
        marginTop:40
    },
    input:{
        marginBottom:10
    },
    textArea:{
        height:150,
        width:"100%",
        padding:0,
        margin:0
    },
    btnContainer:{
        flex:1,
        justifyContent:'flex-end',
        marginTop:20,
        marginBottom:10,
        width:"95%"
    },
    btn:{
        backgroundColor:'#00a680'
    }
});

export default AddReviewRestaurant;