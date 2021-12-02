import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import {firebaseApp} from '../../utils/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { UserLogged } from './UserLogged';
import { UserGuest } from './UserGuest';

const auth = getAuth(firebaseApp);

export const Account = () => {

    const [login, setLogin] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged((user)=>{
            console.log("Usuario", user)
            !user?setLogin(false):setLogin(true);
        });
    }, [])

    if(login === null) return <Text>Cargando...</Text>

    return login ? <UserLogged />:<UserGuest />;
}
