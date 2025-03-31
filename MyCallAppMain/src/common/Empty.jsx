import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, Text, View } from "react-native";

const Empty = ({icon,message}) => {
    return (
        <View style={styles.emptyContainer}>
            <FontAwesomeIcon icon={icon} size={120} color="#b0b0b0" />
            <Text style={{ fontSize: 30, color: 'gray' }}>{message}</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 120,
    },
})
export default Empty;