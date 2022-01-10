import React from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';

const ListRestaurants = ({restaurants = [], handleLoadMore, isLoading}) => {
    return (
        <View>
            {restaurants.length > 0 
                ? 
                (
                    <FlatList 
                        data={restaurants}
                        renderItem = {(restaurant)=> <Restaurant restaurant={restaurant}/>}
                        keyExtractor={item => item.id}
                        onEndReachedThreshold={0.5}
                        onEndReached={handleLoadMore}
                        ListFooterComponent={<FooterList isLoading={isLoading}/>}
                    />

                    
                )
                :
                (<View style={styles.loaderRestaurants}>
                    <ActivityIndicator size="large" color="#00a680"/>
                    <Text>Cargando restaurantes</Text>
                </View>)
            }
        </View>
    )
}

const FooterList = ({isLoading})=>{
    if(isLoading){
        return (
            <View style={styles.loaderRestaurants}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }else{
        return (
            <View style={styles.notFoundRestaurant}> 
                <Text>No quedan restaurantes por cargar</Text>
            </View>
        )
    }
}

const Restaurant = ({restaurant})=>{
    const {images, name, description, address}= restaurant.item; 
    const imageRestaurant = images[0];

    const goRestaurant = ()=>{
        console.log("ok")
    }

    return (
        <TouchableOpacity
            onPress={goRestaurant}
        >
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImage}>
                    <Image 
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff"/>}
                        source={
                            imageRestaurant
                            ?
                            {uri:imageRestaurant}
                            :
                            require('../../../assets/img/no-image.png')
                        }
                        style={styles.imageRestaurant}
                    />
                </View>
                <View>
                    <Text style={styles.restaurantName}>{name}</Text>
                    <Text style={styles.restaurantAddress}>{address}</Text>
                    <Text style={styles.restaurantDescription}>{description.substr(0,60)}...</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ListRestaurants

const styles = StyleSheet.create({
    loaderRestaurants:{
        marginTop:10,
        marginBottom:10,
        alignItems:'center'
    },
    viewRestaurant:{
        flexDirection:'row',
        margin:10
    },
    viewRestaurantImage:{
        marginRight:15
    },
    imageRestaurant:{
        width:80,
        height:80
    },
    restaurantName:{
        fontWeight:'bold'
    },
    restaurantAddress:{
        paddingTop:2,
        color:'grey'
    },
    restaurantDescription:{
        paddingTop:2,
        color:'grey',
        width:300
    },
    notFoundRestaurant:{
        marginTop:10,
        marginBottom:20,
        alignItems:'center'
    }
});
