import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import {firebaseApp} from '../../utils/firebase';
import { getAuth, updateEmail } from 'firebase/auth';
import { reauthenticate } from '../../utils/api';
import { validateEmail } from '../../utils/validations';

const auth = getAuth(firebaseApp);

const initForm = {
    email:'',
    password:''
}

const ChangeEmailForm = ({email, setShowModal, toastRef, setReloadUserInfo}) => {

    const [formData, setFormData] = useState(initForm);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFormData({...formData, ['email']:email});
    }, []);

    const onChange = (e, type)=>{
        setFormData({...formData, [type]:e.nativeEvent.text});
    }

    const onSubmit =async ()=>{
        setError({});
        if(!formData.email || email === formData.email){
            setError({email:'El email no ha cambiado'});
            return;
        }else if(!validateEmail(formData.email)){
            setError({email:'Email incorrecto'});
            return;
        }else if(!formData.password){
            setError({password:'La contraseña no puede estar vacia'});
            return;
        }
        
        try {
            setIsLoading(true);
            const res = await reauthenticate(formData.password);   
            
            const resUpdate = await updateEmail(auth.currentUser, formData.email);
            toastRef.current.show("Email actualizado");
            setReloadUserInfo(true);
            setIsLoading(false);
            setShowModal(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error)
            setError({email:'Error al actualizar el email'});
        }
    }

    return (
        <View style={styles.view}>
            <Input 
                placeholder='Correo electrónico'
                containerStyle={styles.input}
                defaultValue={email || ''}
                onChange={(e)=>onChange(e, "email")}
                rightIcon={{
                    type:'material-community',
                    name:'at',
                    color:'#c2c2c2'
                }}
                errorMessage={errors.email}
            />

            <Input 
                placeholder='Contraseña'
                containerStyle={styles.input}
                password={true}
                secureTextEntry={!showPassword}
                onChange={(e)=>onChange(e, "password")}
                rightIcon={{
                    type:'material-community',
                    name:showPassword?'eye-off-outline':'eye-outline',
                    color:'#c2c2c2',
                    onPress:()=> setShowPassword(!showPassword)
                }}
                errorMessage={errors.password}
            />
            <Button 
                title='Cambiar email'
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    )
}

export default ChangeEmailForm

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
