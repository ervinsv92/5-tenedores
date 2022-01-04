import { map } from 'lodash';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import Modal from '../Modal';
import ChangeDisplayNameForm from './ChangeDisplayNameForm';


const AccountOptions = ({userInfo, toastRef, setReloadUserInfo}) => {

    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);

    const selectComponent = (key)=>{
        switch (key) {
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm 
                        displayName={userInfo.displayName}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />);
                setShowModal(true);
                break;
            case "email":
                setRenderComponent(<Text>Cambiando email</Text>);
                setShowModal(true);
                break;
            case "password":
                setRenderComponent(<Text>Cambiando password</Text>);
                setShowModal(true);
                break;
            default:
                setRenderComponent(null);
                setShowModal(false);
                break;
        }
    }

    const menuOptions = generateOptions(selectComponent);

    return (
        <View>
            {
                map(menuOptions, (menu, index)=>(
                    <ListItem 
                        key={index} 
                        title={menu.title}
                        leftIcon={{
                            type:menu.iconType,
                            name:menu.iconNameLeft,
                            color:menu.iconColorLeft
                        }}
                        rightIcon={{
                            type:menu.iconType,
                            name:menu.iconNameRight,
                            color:menu.iconColorRight
                        }}
                        containerStyle={styles.menuItem}
                        onPress={menu.onPress}
                    />
                ))
            }
            {renderComponent && (
                <Modal 
                    isVisible={showModal}
                    setIsVisible={setShowModal}
                >
                    {renderComponent}
                </Modal>
            )}
            
        </View>
    )
}

const generateOptions = (selectComponent)=>{
    return [
        {
            title:"Cambiar Nombre y Apellidos", 
            iconType:"material-community", 
            iconNameLeft:"account-circle", 
            iconColorLeft:"#ccc", 
            iconNameRight:"chevron-right", 
            iconColorRight:"#ccc",
            onPress:()=> selectComponent("displayName")
        },
        {
            title:"Cambiar Email", 
            iconType:"material-community", 
            iconNameLeft:"at", 
            iconColorLeft:"#ccc", 
            iconNameRight:"chevron-right", 
            iconColorRight:"#ccc",
            onPress:()=> selectComponent("email")
        },
        {
            title:"Cambiar Contraseña", 
            iconType:"material-community", 
            iconNameLeft:"lock-reset", 
            iconColorLeft:"#ccc", 
            iconNameRight:"chevron-right", 
            iconColorRight:"#ccc",
            onPress:()=> selectComponent("password")
        }
    ];
}

export default AccountOptions

const styles = StyleSheet.create({
    menuItem:{
        borderBottomWidth:1,
        borderBottomColor:"#e3e3e3"
    }
})