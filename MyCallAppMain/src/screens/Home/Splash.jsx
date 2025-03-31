import { Animated, SafeAreaView, StatusBar, Text, View } from "react-native"
import MyStyles from "../../styles/MyStyles";
import Title from "../../common/Title";
import { useEffect, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const Splash  = () => {
    const nav = useNavigation();
    useLayoutEffect(()=>{
            nav.setOptions({
                headerShown: false
            })
    }, [])
    const translateY = new Animated.Value(0);
    const duration = 800;
    useEffect(() =>{
        Animated.loop(
        Animated.sequence([
            Animated.timing(translateY, {
                toValue: 20,
                duration: duration,
                useNativeDriver: true
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: duration,
                useNativeDriver: true
            })
        ])).start();
    },[])
    return(
        <SafeAreaView style ={MyStyles.container}> 
            <StatusBar barStyle='light-content' />
            <Animated.View style={{ transform:[{translateY}]}}>
            <Title text = "Real Time Chat App" color='white'/>
            </Animated.View>
    </SafeAreaView>
    )
}
export default Splash;