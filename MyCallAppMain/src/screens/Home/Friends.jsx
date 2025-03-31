import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Empty from "../../common/Empty";
import Cell from "../../common/Cell";
import useGlobal from "../../core/global";
import utils from "../../core/utils";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

const Friends = () => {
    const friendList = useGlobal(state => state.friendList);
    const nav= useNavigation();
    const FriendItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={ ()=> nav.navigate('Message',{'friend':item.friend,'id':item.id})}>
            <Cell>
                <Image
                source={utils.thumbnail(item.friend.thumbnail)}
                    style={styles.image}
                />
                <View style={{
                    flex: 1,
                    paddingHorizontal: 16
                }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{item.friend.name}</Text>
                    <Text style={{ marginBottom: 4 }}>{item.preview} {moment(item.updated_at).fromNow()}</Text>
                </View>
            </Cell>
            </TouchableOpacity>
        )
    }
    return (
        <View>
            <FlatList
                data={friendList}
                renderItem={({ item }) => <FriendItem item={item} />}
                // keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Empty icon='bell' message='No Friends' />}
                contentContainerStyle={friendList.length === 0 && styles.flatListEmpty}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    image: {
        width: 40,
        height: 40,
        borderRadius: 90,
        alignSelf: 'center',
    },
    flatListEmpty: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'red'
    }
})
export default Friends;