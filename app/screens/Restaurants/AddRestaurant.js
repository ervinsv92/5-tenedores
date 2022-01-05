import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-easy-toast';
import { Loading } from '../../components/Loading';
import AddRestaurantForm from '../../components/Restaurants/AddRestaurantForm';

/* Si la pantalla viene directamente del stack, recibe el objeto navigation por defecto */
const AddRestaurant = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();

    return (
        <View>
            <AddRestaurantForm
                toastRef={toastRef}
                setIsLoading={setIsLoading}
                navigation={navigation}
            />
            <Toast ref={toastRef} position='center' opacity={0.9}/>
            <Loading isVisible={isLoading} text='Creando restaurante'/>
        </View>
    )
}

export default AddRestaurant

