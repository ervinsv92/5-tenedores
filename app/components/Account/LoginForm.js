import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import {Input, Icon, Button} from 'react-native-elements';
import { isEmpty } from 'lodash';
import {useNavigation} from "@react-navigation/native";
import {firebaseApp} from '../../utils/firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { validateEmail } from '../../utils/validations';
import { Loading } from '../Loading';

const auth = getAuth(firebaseApp);

const initForm = {
    email:'',
    password:''
}

const LoginForm = ({toastRef}) => {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initForm);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    auth.onAuthStateChanged((user)=>{
        user && navigation.navigate("account");
    })

    const onChange = (e, type)=>{
        setFormData({
            ...formData,
            [type]:e.nativeEvent.text
        });
    }

    const onSubmit = ()=>{
        if(isEmpty(formData.email.trim()) || isEmpty(formData.email.trim())){
            toastRef.current.show('Todos los campos son requeridos');
            return;
        }else if(!validateEmail(formData.email.trim())){
            toastRef.current.show('El email es incorrrecto');
            return;
        }
        setLoading(true);
        signInWithEmailAndPassword(auth,formData.email.trim(), formData.password.trim())
        .then(res=>{
            setLoading(false);
            navigation.goBack();
        })
        .catch(err=>{
            setLoading(false);
            toastRef.current.show('Email o contraseña incorrecta');
        })
    }

    return (
        <View style={styles.formContainer}>
            <Input 
                placeholder='Correo electrónico'
                containerStyle={styles.inputForm}
                onChange={(e)=>onChange(e, "email")}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input 
                placeholder='Contraseña'
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={!showPassword}
                onChange={(e)=>onChange(e, "password")}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name={showPassword?"eye-off-outline":"eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={()=>setShowPassword(!showPassword)}
                    />
                }
            />

            <Button 
                title="Iniciar sesión"
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={onSubmit}
            />

            <Loading isVisible={loading} text="Iniciando sesión" />
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        marginTop:30
    },
    inputForm:{
        width:"100%",
        marginTop:20
    },
    btnContainerLogin:{
        marginTop:20,
        width:"95%"
    },
    btnLogin:{
        backgroundColor:"#00a680"   
    },
    iconRight:{
        color:"#c1c1c1"
    }
});

export default LoginForm
