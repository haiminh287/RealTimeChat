import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import useGlobal from "../../core/global";
import Cell from "../../common/Cell";
import utils from "../../core/utils";
import { useState } from "react";
import Empty from "../../common/Empty";
import moment from "moment";
const RequestAccept = ({item})=>{
    const requestAccepted = useGlobal(state=>state.requestAccepted);
    return (<TouchableOpacity style={{
        paddingHorizontal:14,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:8,
        height:52,
        backgroundColor:'#202020'
    }} onPress={()=>requestAccepted(item.sender.username)}>
        <Text style={{
            color:'white',
            fontWeight:'bold'
        }}>
            Accept
        </Text>
        </TouchableOpacity>)
}
const RequestItem = ({item})=>{
    const message = "Requested to connect with you";
    return (
        <Cell>
             <Image
                    source={utils.thumbnail(item.sender.thumbnail)}
                    style={styles.image}
                />
                <View style={{
                    flex: 1,
                    paddingHorizontal: 16
                }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{item.sender.name}</Text>
                    <Text style={{ marginBottom: 4 }}>{message} {moment(item.created_at).fromNow()}</Text>
                </View>
                <RequestAccept item={item} />
        </Cell>
    )
}
const Requests = () => {
    const requestAcceptList = useGlobal(state=>state.requestAcceptList);
    if(requestAcceptList===null){
        return (<View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>);
    }
    return (
        <View>
            <FlatList
                data={requestAcceptList}
                renderItem={({ item }) => <RequestItem item={item} />}
                // keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Empty icon='bell' message='No Request Accepted' />}
                contentContainerStyle={requestAcceptList.length === 0 && styles.flatListEmpty}
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
export default Requests;