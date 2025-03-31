import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, SafeAreaView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import Button from "../../common/Button";
import MyStyles from "../../styles/MyStyles";
import { HelperText } from "react-native-paper";
import apis, { endpoints } from "../../core/apis";

const Register = () => {
    const [user, setUser] = useState({
        "username": "",
        "password": "",
    });
    const [err, setErr] = useState({
        passwordMismatch: false,
        emptyFields: false
    });
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const users = {
        "first_name": {
            "id": 1,
            "title": "Tên",
            "field": "first_name",
            "secure": false,
            "icon": "text"
        },
        "last_name": {
            "id": 2,
            "title": "Họ và tên lót",
            "field": "last_name",
            "secure": false,
            "icon": "text"
        },
        "username": {
            "id": 3,
            "title": "Tên đăng nhập",
            "field": "username",
            "secure": false,
            "icon": "text"
        },
        "password": {
            "id": 4,
            "title": "Mật khẩu",
            "field": "password",
            "secure": true,
            "icon": "eye"
        },
        "confirm": {
            "id": 5,
            "title": "Xác nhận mật khẩu",
            "field": "confirm",
            "secure": true,
            "icon": "eye"
        }
    };

    const updateUser = (value, field) => {
        setUser({ ...user, [field]: value });
    };

    const handleRegister = async () => {
        const emptyFields = Object.values(user).some(value => value === "");
        const passwordMismatch = user.password !== user.confirm;
        if (emptyFields) {
            setErr({  emptyFields: true, passwordMismatch: false });
        } else if (passwordMismatch) {
            setErr({ passwordMismatch: true, emptyFields: false });
        } else {
            setErr({ passwordMismatch: false, emptyFields: false });
            try{
                setLoading(true);
                let res =  await apis.post(endpoints['register'],user);
                console.log(res.data);
            }catch(e){
                console.log(e);
            }finally{
                setLoading(false);
                nav.navigate('Login');
        }}
    };

    useLayoutEffect(() => {
        nav.setOptions({
            headerShown: false
        });
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
                    <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: '#202020' }}>Register</Text>
                    {err.emptyFields ? (<HelperText type="error" visible={err.emptyFields}>
                        Vui lòng điền đầy đủ các trường
                    </HelperText>):
                    err.passwordMismatch ? (<HelperText type="error" visible={err.passwordMismatch}>
                        Mật khẩu không khớp
                        </HelperText>
                    ): null}
                    {Object.keys(users).map(key => {
                        const u = users[key];
                        return (
                            <View key={u.id}>
                                <Text style={MyStyles.titleInput}>{u.title}</Text>
                                <TextInput
                                    style={MyStyles.textInput}
                                    // placeholder={u.title}
                                    secureTextEntry={u.secure}
                                    value={user[u.field]}
                                    onChangeText={t => updateUser(t, u.field)}
                                />
                            </View>
                        );
                    })}
                    <Button title="Register" onPress={handleRegister} />
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#70747a' }}>
                        Already have an account? <Text style={{ color: '#202020', fontWeight: 'bold' }} onPress={() => nav.goBack()}>Login</Text>
                    </Text>
                </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Register;