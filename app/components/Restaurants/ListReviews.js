import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import {firebaseApp} from '../../utils/firebase';
import { getAuth } from 'firebase/auth';
import { Avatar, Button, Rating } from 'react-native-elements';
import { getFirestore, getDocs, collection, query, orderBy, limit, startAfter, where} from 'firebase/firestore';
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const ListReviews = ({navigation, idRestaurant}) => {
    const [userLogged, setUserLogged] = useState(false);
    const [reviews, setReviews] = useState([]);
    auth.onAuthStateChanged((user)=>{
        user?setUserLogged(true):setUserLogged(false)
    });

    useEffect(() => {
        (async ()=>{
            try {
                const q = query(collection(db, "reviews"), orderBy('createAt', 'desc'), where('idRestaurant', '==', idRestaurant));
                const querySnapshot = await getDocs(q);
                let rest = [];
                
                querySnapshot.forEach((doc) => {
                    rest.push({
                        id:doc.id,
                        ...doc.data()
                    })
                });
                setReviews(rest);
                console.log("comentarios: ", rest)    
            } catch (error) {
                console.log("EEEError: ", error)    
            }
            
            //setTotalRestaurants(rest.length);
            //setRestaurants(rest);
            //setStartRestaurant(rest[rest.length-1]);
            //console.log("total restaurants: ", totalRestaurants)
            //console.log("start rest: ", startRestaurant)
        })()
    }, []);
    

  return (
    <View>
      {
          userLogged ? (
            <Button 
                title="Escribe una opinión"
                buttonStyle={styles.btnAddReview}
                titleStyle={styles.btnTitleAddReview}
                icon={{
                    type:'material-community',
                    name:'square-edit-outline',
                    color:'#00a680'
                }}
                onPress={()=>navigation.navigate("add-review-restaurant", {idRestaurant})}
            />
          ):
          (
              <View>
                  <Text
                    style={{
                        textAlign:'center',
                        color:"#00a680",
                        padding:20
                    }}
                    onPress={()=>navigation.navigate('login')}
                  >
                      Para escribir un comentario es necesario estar logeado{" "}
                      <Text style={{fontWeight:'bold'}}>
                          pulsa AQUÍ para iniciar sesión
                      </Text>
                  </Text>
              </View>
          )
      }

      {
          reviews.map((review, index) => (
            <Review key={index} review={review}/>
          ))
      }

      
    </View>
  );
};

const Review = (props)=>{
    const {title, review, rating, createAt, avatarUser} = props.review;
    const createReview = new Date(createAt.seconds * 1000);

    return (
        <View style={styles.viewReview}>
            <View style={styles.viewImageAvatar}>
                <Avatar 
                    size="large"
                    rounded
                    containerStyle={styles.imageAvatarUser}
                    source={avatarUser?{uri:avatarUser}:require('../../../assets/img/avatar-default.jpg')}
                />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.reviewText}>{review}</Text>
                <Rating 
                    imageSize={15}
                    startingValue={rating}
                    readonly
                />
                <Text style={styles.reviewDate}>
                    {createReview.getDate()}/{createReview.getMonth()}/{createReview.getFullYear()} - 
                    {createReview.getHours()}:{createReview.getMinutes()<10?"0":""}{createReview.getMinutes()}
                </Text>
            </View>
        </View>
    )
}

export default ListReviews;

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor:'transparent'
    },
    btnTitleAddReview:{
        color:"#00a680"
    },
    viewReview:{
        flexDirection:'row',
        padding:10,
        paddingBottom:20,
        borderBottomColor:'#e3e3e3',
        borderBottomWidth:1
    },
    viewImageAvatar:{
        marginRight:15
    },
    imageAvatarUser:{
        width:50,
        height:50
    },
    viewInfo:{
        flex:1,
        alignItems:'flex-start'
    },
    reviewTitle:{
        fontWeight:'bold'
    },
    reviewText:{
        paddingTop:2,
        color:'grey',
        marginBottom:5
    },
    reviewDate:{
        marginTop:5,
        color:'grey',
        fontSize:12,
        position:'absolute',
        right:0,
        bottom:0
    }
});
