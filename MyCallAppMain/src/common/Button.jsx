import { Text, TouchableOpacity, View } from "react-native";

const Button = ({ title,onPress,loading }) => {
    return (
        <TouchableOpacity onPress={onPress} loading={loading}>
        <View style={{backgroundColor:'#202020',height:52,borderRadius:26,alignItems:'center',
        justifyContent:'center',marginTop:20}}>
            <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>{title}</Text>
        </View>
        </TouchableOpacity>

    );
}
export default Button;