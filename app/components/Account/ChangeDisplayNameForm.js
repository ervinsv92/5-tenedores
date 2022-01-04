import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import {firebaseApp} from '../../utils/firebase';
import { getAuth, updateProfile } from 'firebase/auth';
const auth = getAuth(firebaseApp);

const ChangeDisplayNameForm = ({displayName, setShowModal, toastRef, setReloadUserInfo}) => {
    const [newDisplayName, setNewDisplayName] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async ()=>{
        setError(null);

        if(!newDisplayName){
            setError("El nombre no puede estar vacio");
            return;
        }else if(displayName === newDisplayName){
            setError("El nombre no debe ser igual al actual");
            return;
        }

        try {
            setIsLoading(true);
            const res = await updateProfile(auth.currentUser, {
                displayName:newDisplayName
            })    
            
            setIsLoading(false);
            setReloadUserInfo(true);
            setShowModal(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error)
        }
    }    

    return (
        <View style={styles.view}>
            <Input 
                placeholder='Nombre y apellido'
                containerStyle={styles.input}
                rightIcon={{
                    type:'material-community',
                    name:'account-circle-outline',
                    color:'#c2c2c2'
                }}
                defaultValue={displayName || ""}
                onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
                errorMessage={error}
            />
            <Button 
                title="Cambiar nombre"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    )
}

export default ChangeDisplayNameForm

const styles = StyleSheet.create({
    view:{
        alignItems:'center',
        paddingTop:10,
        paddingBottom:10
    },
    input:{
        marginBottom:10
    },
    btnContainer:{
        marginTop:20,
        width:"95%"
    },
    btn:{
        backgroundColor:"#00a680"
    }
})
