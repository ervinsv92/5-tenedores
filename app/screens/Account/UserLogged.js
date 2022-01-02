import React from 'react'
import { View, Text, Button } from 'react-native'
import {firebaseApp} from '../../utils/firebase';
import { getAuth, signOut } from "firebase/auth";
const auth = getAuth(firebaseApp);

export const UserLogged = () => {
    return (
        <View>
            <Text>User logged</Text>
            <Button title='Cerrar sesión' onPress={()=> signOut(auth)}/>
        </View>
    )
}
