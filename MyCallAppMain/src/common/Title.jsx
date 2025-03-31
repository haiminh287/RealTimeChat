import { Text } from "react-native";
import MyStyles from "../styles/MyStyles";

const Title = ({text,color}) => {
    return (
        <Text style={[MyStyles.textTitle,{color:color}]} >{text}</Text>
    )
}
export default Title;