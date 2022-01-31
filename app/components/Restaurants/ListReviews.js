import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import {firebaseApp} from '../../utils/firebase';
import { getAuth } from 'firebase/auth';
import { Button } from 'react-native-elements';
const auth = getAuth(firebaseApp);

const ListReviews = ({navigation, idRestaurant, setRating}) => {
    const [userLogged, setUserLogged] = useState(false);
    auth.onAuthStateChanged((user)=>{
        user?setUserLogged(true):setUserLogged(false)
    });

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
    </View>
  );
};

export default ListReviews;

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor:'transparent'
    },
    btnTitleAddReview:{
        color:"#00a680"
    }
});
