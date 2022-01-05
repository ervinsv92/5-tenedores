import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {Button, Input} from 'react-native-elements';
import {firebaseApp} from '../../utils/firebase';
import { getAuth, updatePassword, signOut } from 'firebase/auth';
import { reauthenticate } from '../../utils/api';
const auth = getAuth(firebaseApp);

const initForm = {
    password:'',
    newPassword:'',
    repeatNewPassword:''
};

const ChangePasswordForm = ({setShowModal, toastRef}) => {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initForm);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e,type)=>{
        setFormData({...formData, [type]:e.nativeEvent.text});
    }

    const onSubmit = async ()=>{
        let errorTemp = {};
        setErrors({});
        if(!formData.password || !formData.newPassword || !formData.repeatNewPassword){
            errorTemp = {
                password:!formData.password ? 'La contraseña no puede estar vacia':'',
                newPassword:!formData.newPassword ? 'La contraseña no puede estar vacia':'',
                repeatNewPassword:!formData.repeatNewPassword ? 'La contraseña no puede estar vacia':''
            }
        }else if(formData.newPassword !== formData.repeatNewPassword){
            errorTemp = {
                newPassword:'Las contraseñas no son iguales',
                repeatNewPassword:'Las contraseñas no son iguales'
            }
        }else if(formData.newPassword.trim().length<6){
            errorTemp = {
                newPassword:'La contraseña tiene que ser mayor a 5 caracteres',
                repeatNewPassword:'La contraseña tiene que ser mayor a 5 caracteres',
            }
        }

        if(Object.keys(errorTemp).length !== 0){
            setErrors(errorTemp);
            return;
        }

        try {
            setIsLoading(true);
            const res = await reauthenticate(formData.password);   
            const resUpdate = await updatePassword(auth.currentUser, formData.newPassword);
            toastRef.current.show("Contraseña actualizada");
            setIsLoading(false);
            setShowModal(false);
            await signOut(auth)
        } catch (error) {
            setIsLoading(false);
            console.log(error)
            setErrors({password:'Error al actualizar la contraseña'});
        }
    }

    return (
        <View style={styles.view}>
            <Input 
                placeholder='Contraseña actual'
                containerStyle={styles.input}
                password={true}
                secureTextEntry={!showPassword}
                onChange={(e)=>onChange(e, 'password')}
                errorMessage={errors.password}
                rightIcon={{
                    type:'material-community',
                    name:showPassword?'eye-off-outline':'eye-outline',
                    color:"#c2c2c2",
                    onPress: ()=> setShowPassword(!showPassword)
                }}
            />

            <Input 
                placeholder='Nueva contraseña'
                containerStyle={styles.input}
                password={true}
                secureTextEntry={!showPassword}
                onChange={(e)=>onChange(e, 'newPassword')}
                errorMessage={errors.newPassword}
                rightIcon={{
                    type:'material-community',
                    name:showPassword?'eye-off-outline':'eye-outline',
                    color:"#c2c2c2",
                    onPress: ()=> setShowPassword(!showPassword)
                }}
            />

            <Input 
                placeholder='Repetir nueva contraseña'
                containerStyle={styles.input}
                password={true}
                secureTextEntry={!showPassword}
                onChange={(e)=>onChange(e, 'repeatNewPassword')}
                errorMessage={errors.repeatNewPassword}
                rightIcon={{
                    type:'material-community',
                    name:showPassword?'eye-off-outline':'eye-outline',
                    color:"#c2c2c2",
                    onPress: ()=> setShowPassword(!showPassword)
                }}
            />

            <Button 
                title='Cambiar contraseña'
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    )
}

export default ChangePasswordForm

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
        backgroundColor:'#00a680'
    }
});
