import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {Input, Icon, Button} from 'react-native-elements';
import {validateEmail} from '../../utils/validations';
import { size , isEmpty} from 'lodash';
import {firebaseApp} from '../../utils/firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {useNavigation} from "@react-navigation/native";
const auth = getAuth(firebaseApp);

const initForm = {
    email:'',
    password:'',
    repeatPassword:''
}

const RegisterForm = ({toastRef}) => {

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [formData, setFormData] = useState(initForm);
    const navigation = useNavigation();
    const onSubmit = ()=>{

        console.log("form: ", formData)

        if(isEmpty(formData.email.trim()) || isEmpty(formData.password.trim()) || isEmpty(formData.repeatPassword.trim())){
            toastRef.current.show("Todos los campos son obligatorios");
            return;
        }else if(!validateEmail(formData.email.trim())){
            toastRef.current.show("El email no es correcto");
            return;
        }else if(formData.password.trim() !== formData.repeatPassword.trim()){
            toastRef.current.show("Las contraseñas deben ser iguales");
            return;
        }else if(size(formData.password.trim())<6){
            toastRef.current.show("La debe contener minimo 6 caracteres.");
            return;
        }

        createUserWithEmailAndPassword(auth,formData.email.trim(), formData.password.trim())
        .then(response=>{
            console.log(response);
            navigation.navigate('account');
        })
        .catch(err => {
            toastRef.current.show("El email ya está en uso");
        });
    }

    const onChange = (e, type)=>{
        setFormData({...formData, [type]:e.nativeEvent.text});
    }

    return (
        <View style={styles.formContainer}>
            <Input 
                placeholder="Correo electrónico"
                containerStyle={styles.inputForm}
                onChange={e=> onChange(e, "email")}
                rightIcon={
                    <Icon type="material-community" name="at" iconStyle={styles.iconRight}/>
                }
            />

            <Input 
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={!showPassword}
                onChange={e=> onChange(e, "password")}
                rightIcon={
                    <Icon 
                        type="material-community" 
                        name={showPassword?"eye-off-outline":"eye-outline" }
                        iconStyle={styles.iconRight}
                        onPress={()=> setShowPassword(!showPassword)}
                    />
                }
                
            />

            <Input 
                placeholder="Repetir Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={!showRepeatPassword}
                onChange={e=> onChange(e, "repeatPassword")}
                rightIcon={
                    <Icon 
                        type="material-community" 
                        name={showRepeatPassword?"eye-off-outline":"eye-outline" }
                        iconStyle={styles.iconRight}
                        onPress={()=> setShowRepeatPassword(!showRepeatPassword)}
                    />
                }
            />
            <Button 
                title="Unirse"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
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
    btnContainerRegister:{
        marginTop:20,
        width:"95%"
    },
    btnRegister:{
        backgroundColor:"#00a680"
    },
    iconRight:{
        color:"#c1c1c1"
    }
});

export default RegisterForm
