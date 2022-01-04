import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import {firebaseApp} from '../../utils/firebase';
import { getAuth, updateProfile  } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
//import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);
//console.log(storage)
//var storageRef = firebaseApp.storage().ref();


const InfoUser = ({userInfo, toastRef, setLoading, setLoadingText}) => {
    const {uid, photoURL, displayName, email} = userInfo;
    
    const changeAvatar = async ()=>{
        const resultPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        //console.log(resultPermission)
        //const resultPermissionCameraRoll = resultPermission.permissions.cameraRoll.status;
        //console.log(resultPermissionCameraRoll)
        if(resultPermission === "denied"){
           toastRef.current.show("Es necesario aceptar los permisos de la galería");
            return;
        }
        
        const resultImage = await ImagePicker.launchImageLibraryAsync({
            allowsEditing:true,
            aspect:[4,3]
        });
        
        if(resultImage.cancelled){
            toastRef.current.show("Has cerrado la selección de imagenes");
            return;
        }

        uploadImage(resultImage.uri).then((url)=>{
            console.log("imagen subida", url)
        })
        .catch((err)=>{
            console.log(err)
            console.log("Error al subir el avatar")
        });
    }

    const uploadImage = async (uri)=>{
        setLoadingText("Actualizando Avatar");
        setLoading(true);
        let urlAvatar = '';
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            //const ref = storage.ref().child(`avatar/${uid}`);
            // const ref = storageRef.child(`avatar/${uid}`);
            // return ref.put(blob);   

            const imageRef = ref(storage, `avatar/${uid}`);
            const snapshot = await uploadBytesResumable(imageRef, blob)
            urlAvatar = await getDownloadURL(snapshot.ref);
            await updatePhotoUrl(urlAvatar);
            setLoading(false);
            // .then((snapshot) => {
            //     console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            //     //console.log('File metadata:', snapshot.metadata);
            //     // Let's get a download URL for the file.
            //     getDownloadURL(snapshot.ref).then((url) => {
            //     console.log('File available at', url);
            //     // ...
            //     });
            // }).catch((error) => {
            //     console.error('Upload failed', error);
            //     // ...
            // });
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
        return urlAvatar;
    }

    const updatePhotoUrl = (url)=>{
        return updateProfile(auth.currentUser, {
            photoURL:url
        })
        .then(()=>{
            console.log("foto actualizada")
            
            console.log(auth.currentUser)
        })
        .catch((err)=>{
            toastRef.current.show("Error al subir la imagen");
            console.log(err)
        });
    }

    return (
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded
                size="large"
                showEditButton
                containerStyle={styles.userInfoAvatar}
                onEditPress={changeAvatar}
                source={
                    photoURL ? {uri:photoURL}:require('../../../assets/img/avatar-default.jpg')
                }
            />
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName:"Anónimo"}
                </Text>
                <Text>
                    {email ?email:"Social Login"}
                </Text>
            </View>
        </View>
    )
}

export default InfoUser

const styles = StyleSheet.create({
    viewUserInfo:{
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        backgroundColor:'#f2f2f2',
        paddingBottom:30,
        paddingTop:30,
    },
    userInfoAvatar:{
        marginRight:20
    },
    displayName:{
        fontWeight:'bold',
        paddingBottom:5
    }
})
