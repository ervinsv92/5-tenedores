import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Dimensions } from 'react-native';
import {Icon, Avatar, Image, Input, Button} from 'react-native-elements';
import * as ImagePicker from "expo-image-picker";
import Modal from '../Modal';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

const widthScreen = Dimensions.get("window").width;

const AddRestaurantForm = ({toastRef, setIsLoading,navigation}) => {

    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantAdress, setRestaurantAdress] = useState('');
    const [restaurantDescription, setRestaurantDescription] = useState('');
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);

    const addRestaurant = async ()=>{
        
    }

    return (
        <ScrollView style={styles.scrollView}>

            <ImageRestaurant image={imageSelected[0]} />
            <FormAdd 
                setRestaurantName={setRestaurantName}
                setRestaurantAdress={setRestaurantAdress}
                setRestaurantDescription={setRestaurantDescription}
                setIsVisibleMap={setIsVisibleMap}
            />
            <UploadImage toastRef={toastRef} setImageSelected={setImageSelected} imageSelected={imageSelected}/>
            <Button 
                title='Crear Restaurante'
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <Map isVisibleMap={isVisibleMap} setIsVisibleMap={setIsVisibleMap} toastRef={toastRef} />
        </ScrollView>
    )
}

const FormAdd = ({setRestaurantName, setRestaurantAdress, setRestaurantDescription, setIsVisibleMap})=>{
    return (
        <View style={styles.viewForm}>
            <Input 
                placeholder='Nombre del restaurante'
                containerStyle={styles.input}
                onChange={e => setRestaurantName(e.nativeEvent.text)}
            />

            <Input 
                placeholder='Dirección'
                containerStyle={styles.input}
                onChange={e => setRestaurantAdress(e.nativeEvent.text)}
                rightIcon={{
                    type:'material-community',
                    name:'google-maps',
                    color:'#c2c2c2',
                    onPress:() => setIsVisibleMap(true)
                }}
            />

            <Input 
                placeholder='Descripción del restaurante'
                containerStyle={styles.input}
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={e => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    );
}

const Map= ({isVisibleMap, setIsVisibleMap, toastRef})=>{
    const [location, setLocation] = useState(null);
    useEffect(() => {
        (async ()=>{
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    toastRef.current.show('El permiso para acceder a la localización ha sido denegado por el usuario', 3000);
                return;
                }

                const loc = await Location.getCurrentPositionAsync();
                setLocation({
                    latitude:loc.coords.latitude,
                    longitude:loc.coords.longitude,
                    latitudeDelta:0.001,
                    longitudeDelta:0.001
                });
                console.log(loc)
            } catch (error) {
                
            }
            
        })()
    }, []);

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location &&
                    <MapView 
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region)=> setLocation(region)}
                    >
                        <MapView.Marker 
                            coordinate={{
                                latitude:location.latitude,
                                longitude:location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                }
            </View>
        </Modal>
    );
}

const UploadImage = ({toastRef, setImageSelected, imageSelected})=>{

    const imageSelect = async ()=>{
        const resultPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if(resultPermission === "denied"){
           toastRef.current.show("Es necesario aceptar los permisos de la galería", 3000);
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

        setImageSelected([...imageSelected, resultImage.uri]);
    }

    const removeImage = (image)=>{

        Alert.alert(
            "Eliimnar imagen",
            "¿Desea borrar la imagen?",
            [
                {
                    text:"Cancel",
                    style:"Cancel"
                },
                {
                    text:"Eliminar",
                    style:"Cancel",
                    onPress:()=>{
                        setImageSelected(imageSelected.filter(x=>x!=image));
                    }

                }
            ],
            {cancelable:false}
        );
    }

    return (
        <View style={styles.viewImages}>
            {
                (imageSelected.length < 4) && 
                <Icon
                    type='material-community'
                    name='camera'
                    color='#7a7a7a'
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            }

            {
                imageSelected.map((image, idx)=>(
                    <Avatar 
                        key={idx}
                        style={styles.miniatureStyle}
                        source={{
                            uri:image
                        }}
                        onPress={()=>removeImage(image)}
                    />   
                ))
            }
        </View>
    );
}

const ImageRestaurant = ({image})=>{
    return (
        <View style={styles.viewPhoto}>
            <Image 
                source={image?{uri:image}:require('../../../assets/img/no-image.png')}
                style={{width:widthScreen, height:200}}
            />
        </View>
    );
}

export default AddRestaurantForm

const styles = StyleSheet.create({
    scrollView:{
        height:'100%'
    },
    viewForm:{
        marginLeft:10,
        marginRight:10
    },
    input:{
        marginBottom:10
    },
    textArea:{
        height:100,
        width:'100%',
        padding:0,
        margin:0
    },
    btnAddRestaurant:{
        backgroundColor:'#00a680',
        margin:20
    },
    viewImages:{
        flexDirection:'row',
        marginLeft:20,
        marginRight:20,
        marginTop:30
    },
    containerIcon:{
        alignItems:'center',
        justifyContent:'center',
        marginRight:10,
        height:70,
        width:70,
        backgroundColor:'#e3e3e3'
    },
    miniatureStyle:{
        width:70,
        height:70,
        marginRight:10
    },
    viewPhoto:{
        alignItems:'center',
        height:200,
        marginBottom:20
    },
    mapStyle:{
        width:'100%',
        height:550
    }
});
