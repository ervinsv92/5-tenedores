import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import {firebaseApp} from '../../utils/firebase';
import { getAuth, signOut } from "firebase/auth";
import { Loading } from '../../components/Loading';
import InfoUser from '../../components/Account/InfoUser';
const auth = getAuth(firebaseApp);

export const UserLogged = () => {
    const toastRef = useRef();
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        (async ()=>{
            const user = await auth.currentUser;
            setUserInfo(user);
        })();
    }, [])

    return (
        <View style={styles.viewUserInfo}>
            {userInfo && <InfoUser 
                            userInfo={userInfo} 
                            toastRef={toastRef}
                            setLoading={setLoading}
                            setLoadingText={setLoadingText}
                         />}
            <Text>AccountOptions</Text>
            <Button 
                title='Cerrar sesión' 
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionText}
                onPress={()=> signOut(auth)}
            />

            <Toast ref={toastRef} position='center' opacity={0.9}/>
            <Loading text={loadingText} isVisible={loading}/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo:{
        minHeight:'100%',
        backgroundColor:"#f2f2f2"
    },
    btnCloseSession:{
        marginTop:30,
        borderRadius:0,
        backgroundColor:"#fff",
        borderWidth:1,
        borderTopColor:"#e3e3e3",
        borderBottomWidth:1,
        borderBottomColor:"#e3e3e3",
        paddingTop:10,
        paddingBottom:10
    },
    btnCloseSessionText:{
        color:"#00a680"
    }
});