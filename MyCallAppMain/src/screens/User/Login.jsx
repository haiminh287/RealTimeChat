import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text,TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import Title from "../../common/Title";
import Button from "../../common/Button";
import { HelperText } from "react-native-paper";
import apis, { authApis, endpoints } from "../../core/apis";
import useGlobal from "../../core/global";


const Login = () => {
    const [user, setUser] = useState({
        "username": "",
        "password": ""
    });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState({
        errorPassword: false,
        emptyFields: false
    });
    const login = useGlobal(state=>state.login);
    const handleLogin = async () => {
        try{
            setLoading(true);
            const emptyFields = Object.values(user).some(value => value === "");
        if(emptyFields){
            setErr({...err, emptyFields: true,errorPassword: false});
        }
        else{
            setErr({...err, errorPassword: false,emptyFields: false});
            try{
                let res =  await apis.post(endpoints['login'], {
                    ...user,
                    'grant_type': 'password',
                    'client_id': '8IeDEr9ukmmGNn9W9xHx0RdD4lVHrleyddogSYvv',
                    'client_secret': 'RkcIfhme5Jdh8EcHjnrYGYUhHmbLEHaGInb6rcouc0fhechGhfJORXAK1HirEFIKFHRRpPyGjB0Jab7B8YPg2RghXmQ35HGvfB4chDNIP1NAMNCE1oy4U8BYGRm6iNWd' 
                });
                setTimeout(async () => {
                    let user = await authApis(res.data.access_token).get(endpoints['current-user']);
                    console.info(user.data);
                    login({token:res.data.access_token},user.data);
                }, 100);
            }
            catch(e){
                setErr({...err, emptyFields: false,errorPassword: true});
            }
        }
        }catch(e){
            console.log(e);
        }
        finally{
            setLoading(false);
        }
        
    }
    const updateUser = (value, field) => {
        setUser({...user, [field]: value});
    }
    const nav = useNavigation();
    const users = {
        "username": {
            "id":1,
            "title": "Tên đăng nhập",
            "field": "username",
            "secure": false,
            "icon": "text"
        },"password": {
            "id":2,
            "title": "Mật khẩu",
            "field": "password",
            "secure": true,
            "icon": "eye"
        }
    }
    useLayoutEffect(() => {
        nav.setOptions({
            headerShown: false
        });
    }, []);
    return (
        <SafeAreaView style={{ flex: 1 }}>
             <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
                    <Title text="Real Time Chat" color='#202020' />
                    {err.emptyFields ?(<HelperText type="error" visible={err.emptyFields}>Vui lòng điền đầy đủ thông tin</HelperText>):
                    err.errorPassword ?(<HelperText type="error" visible={err.errorPassword}>Sai mật khẩu</HelperText>):null
                    }
                    
                    {Object.keys(users).map(key => {
                        const u = users[key];
                        return(
                        <View key={u.id}>
                            <Text style={MyStyles.titleInput}>{u.title}</Text>
                            <TextInput 
                            
                            // right={<TextInput.Icon icon={u.icon}/>} 
                            style={MyStyles.textInput}
                        // placeholder={u.title} 
                        secureTextEntry={u.secure} value={user[u.field]} 
                        onChangeText={t=>updateUser(t,u.field)} /> 
                        </View>)
                })}
                    <Button title="Login" onPress={handleLogin} loading={loading}/>
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#70747a' }}>Don't have an account? <Text style={{ color: '#202020', fontWeight: 'bold' }} onPress={() => nav.navigate('Register')}>Register</Text></Text>
                </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default Login;