import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"



const Cell = ({ children})=>{
    return (
        <View style={styles.container}>
           {children}
        </View>
    )
}
const styles = StyleSheet.create({
    container :{
        flexDirection: 'row',
        paddingHorizontal: 30,
        borderWidth: 1,
        height: 90,
        alignItems: 'center',
        borderColor: '#f0f0f0',
    },
})

export default Cell;