import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserProfile from "../User/UserProfile";
import Friends from "./Friends";
import Requests from "./Requests";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import useGlobal from '../../core/global';
import utils from '../../core/utils';

const Tab = createBottomTabNavigator();
const Home = () => {
    const nav = useNavigation();
    const socketConnect = useGlobal(state => state.socketConnect);
    const socketClose = useGlobal(state => state.socketClose);
    const user = useGlobal(state => state.user);
    const onSearch= ()=>{
        nav.navigate("Search");
    }
    useLayoutEffect(()=>{
            nav.setOptions({
                headerShown: false
            })
    }, [])

    useEffect(()=>{
        socketConnect();
        return () => {
            socketClose();
        }
    },[])
    return (
        <Tab.Navigator
        screenOptions={({route, navigation})=>({
            headerLeft: ()=>(
                <View>
                    {user && <Image
                source={utils.thumbnail(user.thumbnail)}
                style={styles.image}
                />}
                </View>
            ),
            headerRight: ()=>(
                <TouchableOpacity onPress={onSearch}>
                    <FontAwesomeIcon style={{marginRight:16}} icon="magnifying-glass" size={22} color="#404040"/>
                </TouchableOpacity>
            ),
            tabBarIcon:({focused, color, size})=>{
            const icons = 
                {
                Requests: 'bell',
                UserProfile: 'user',
                Friends: 'inbox',
                }
              
            const icon = icons[route.name];
            return (<FontAwesomeIcon icon ={icon} size={28} color={color}/>)
        },
        tabBarActiveTintColor: 'tomato',
        tabBarShowLabel: false,
        })}>
            <Tab.Screen name="Requests" component={Requests} />
            <Tab.Screen name="UserProfile" component={UserProfile}/>
            <Tab.Screen name="Friends" component={Friends} />
        </Tab.Navigator>
    )
}
const styles = StyleSheet.create({
    image:{
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 16
    }
})
export default Home;