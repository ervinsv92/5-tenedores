import React from 'react';
import { View, StyleSheet, ScrollView, Text, Image } from 'react-native';
import {Button} from "react-native-elements";
import {useNavigation} from '@react-navigation/native';

export const UserGuest = () => {

    const navigation = useNavigation();

    return (
        <ScrollView style={styles.viewBody}
            centerContent={true}
        >

            <Image style={styles.image}
                source={require("../../../assets/img/user-guest.jpg")}
                resizeMode="contain"
            />
            <Text style={styles.title}>Consulta tu perfil de 5 tenedores</Text>
            <Text style={styles.description}>Soy otro texto que se tiene que parecer a una descripcion larga para ajustar y ver como queda</Text>
            <View style={styles.viewBtn}>
                <Button
                    title="Ver tu perfil"
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    onPress={()=> navigation.navigate("login")}
                >

                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30
    },
    image:{
        height:300,
        width:"100%",
        marginBottom:40
    },
    title:{
        fontWeight:'bold',
        fontSize:19,
        marginBottom:10,
        textAlign:"center"
    },
    description:{
        textAlign:'center',
        marginBottom:20
    },
    btnStyle:{
        backgroundColor:"#00a680"
    },
    btnContainer:{
        width:"70%"
    },
    viewBtn:{
        flex:1,
        alignItems:"center"
    }
});