import React from "react";
import {createStackNavigator} from '@react-navigation/stack';
import { Account } from "../screens/Account/Account";
import Login from "../screens/Account/Login";
import Register from "../screens/Account/Register";

const Stack = createStackNavigator();

export const AccountStack = ()=>{
    return (
        <Stack.Navigator>
            <Stack.Screen name="account" component={Account} options={{title:"Cuenta"}}/>
            <Stack.Screen name="login" component={Login} options={{title:"Iniciar sesión"}}/>
            <Stack.Screen name="register" component={Register} options={{title:"Registro"}}/>
        </Stack.Navigator>
    )
} 