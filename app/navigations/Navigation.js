import React from 'react';
import { View, Text } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import { RestaurantsStack } from './RestaurantsStack';
import { FavoritesStack } from './FavoritesStack';
import { TopRestaurantsStack } from './TopRestaurantsStack';
import { SearchStack } from './SearchStack';
import { AccountStack } from './AccountStack';

const Tap = createBottomTabNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Tap.Navigator
                initialRouteName="restaurants"
                tabBarOptions={{
                    inactiveTintColor:"#646464",
                    activeTintColor:"#00a680"
                }}
                screenOptions={({route})=>({
                    tabBarIcon:({color})=> screenOptions(route, color)
                })}
            >
                <Tap.Screen name="restaurants" component={RestaurantsStack} options={{title:"Restaurantes"}}/>
                <Tap.Screen name="favorites" component={FavoritesStack} options={{title:"Favoritos"}}/>
                <Tap.Screen name="top-restaurants" component={TopRestaurantsStack} options={{title:"Top 5"}}/>
                <Tap.Screen name="search" component={SearchStack} options={{title:"Buscar"}}/>
                <Tap.Screen name="account" component={AccountStack} options={{title:"Cuenta"}}/>
            </Tap.Navigator>
        </NavigationContainer>
    )
}

const screenOptions = (route, color)=>{
    let iconName;
    switch (route.name) {
        case "restaurants":
            iconName = "compass-outline"
            break;
        case "favorites":
            iconName = "heart-outline"
            break;
        case "top-restaurants":
            iconName = "star-outline"
            break;
        case "search":
            iconName = "magnify"
            break;
        case "account":
            iconName = "home-outline"
            break;            
        default:
            break;
    }
    return <Icon type="material-community" name={iconName} size={22} color={color}/>
}

export default Navigation
