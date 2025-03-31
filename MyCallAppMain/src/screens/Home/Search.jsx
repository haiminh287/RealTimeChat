import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import apis, { authApis, endpoints } from "../../core/apis";
import utils from "../../core/utils";
import useGlobal from "../../core/global";
import secure from "../../core/secure";
import Cell from "../../common/Cell";
import Empty from "../../common/Empty";

const Search = () => {
    const [listUser, setListUser] = useState([]);
    const [kw, setKw] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        try {
            setLoading(true);
            let url = `${endpoints['users']}?page=${page}`;
            if (kw) {
                url += `&kw=${kw}`;
            }
            const credentials = await secure.get('credentials');
            const token = credentials.token;
            const res = await authApis(token).get(url);
            console.log(res.data);
            setListUser(res.data.results);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadUsers();
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [kw]);



    const StatsUser = ({ item }) => {
        const requestConnect = useGlobal(state=>state.requestConnect);
        const requestAccepted = useGlobal(state=>state.requestAccepted);
        const [status, setStatus] = useState(item.status);

        const data = {};
        switch (status) {
            case 'no-connected':
                data.text = 'Kết bạn';
                data.disabled = false;
                data.onPress = () => {
                    requestConnect(item.username);
                    setStatus('pending-them');
                };
                break;
            case 'connected':
                data.text = 'Bạn Bè';
                data.disabled = false;
                data.onPress = () => { };
                break;
            case 'pending-them':
                data.text = 'Chờ Kết Bạn';
                data.disabled = true;
                data.onPress = () => { };
                break;
            case 'pending-me':
                data.text = 'Chấp Nhận';
                data.disabled = false;
                data.onPress = () => { requestAccepted(item.username); setStatus('connected'); };
                break;
        }
        return (
            <TouchableOpacity onPress={data.onPress} disabled={data.disabled}
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 14,
                    borderRadius: 8,
                    height: 40,
                    backgroundColor: data.disabled ? '#505050' : '#202020'
                }}>
                <Text style={{ color: data.disabled ? '#808080' : 'white', fontWeight: 'bold' }}>{data.text}</Text>
            </TouchableOpacity>
        );
    };

    const search = (value, callback) => {
        setPage(1);
        callback(value);
    };

    const Item = ({ item }) => {
        return (
            <Cell>
                <Image
                    source={utils.thumbnail(item.thumbnail)}
                    style={styles.image}
                />
                <View style={{
                    flex: 1,
                    paddingHorizontal: 16
                }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{item.name}</Text>
                    <Text style={{ marginBottom: 4 }}>{item.username}</Text>
                </View>
                <StatsUser item={item} />
            </Cell>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Search..."
                    placeholderTextColor="#b0b0b0"
                    value={kw}
                    onChangeText={t => search(t, setKw)}
                />
                <FontAwesomeIcon icon="search" size={20} color="#404040" style={styles.icon} />
            </View>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <FlatList
                    data={listUser}
                    renderItem={({ item }) => <Item item={item} />}
                    // keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={<Empty icon='triangle-exclamation' message='No Users'/>}
                    contentContainerStyle={listUser.length === 0 && styles.flatListEmpty}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        padding: 16,
        borderBottomWidth: 1,
        borderColor: "#f0f0f0",
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 90,
        alignSelf: 'center',
    },
    textInput: {
        borderRadius: 26,
        backgroundColor: "#e1e2e4",
        height: 52,
        borderColor: 'black',
        padding: 16,
        fontSize: 18,
        paddingLeft: 50
    },
    icon: {
        position: 'absolute',
        top: 32,
        left: 35,
        justifyContent: 'center'
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
});

export default Search;