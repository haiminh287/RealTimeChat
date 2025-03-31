import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Animated, Easing, FlatList, Image, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import utils from "../../core/utils";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import useGlobal from "../../core/global";


const Message = () => {
    const nav = useNavigation();
    const route = useRoute();
    const friend = route.params.friend;
    const connectionId =  route.params.id;
    const [message, setMessage] = useState('');
    const messageSend = useGlobal(state=>state.messageSend);
    const messageList = useGlobal(state=>state.messageList);
    const messageType = useGlobal(state=>state.messageType);
    const messagesList = useGlobal(state=>state.messagesList);
    const messagesNext = useGlobal(state=>state.messagesNext);
    const [loading, setLoading] = useState(false);

    const MessageHeader = ({ friend }) => {
        return (
            <View style={{ flex: 1, flexDirection:'row', alignItems: 'center',justifyContent:'space-between' }}>
                <Image
                    source={utils.thumbnail(friend.thumbnail)}
                    style={styles.image}
                />
                <Text style={{marginLeft:10,fontSize:18,fontWeight:'bold',color:'#202020'}}>{friend.name}</Text>
                <TouchableOpacity onPress={()=>nav.navigate('Call',{'friend':friend})}>
                <FontAwesomeIcon icon="phone" color="#202020" size={24} style={{marginLeft:10}} />
                </TouchableOpacity>
            </View>
        );
    };
    const onType = (value)=>{
        setMessage(value);
        messageType(friend.username);
    }
    const MessageTypingAnimation = ({offset})=>{
        const y= useRef(new Animated.Value(0)).current;
        useEffect(()=>{
            const total = 1000;
            const bump = 200;
            const animation = Animated.loop(
                Animated.sequence([
                    Animated.delay(bump*offset),
                    Animated.timing(y,{
                        toValue:1,
                        duration:bump,
                        easing:Easing.linear,
                        useNativeDriver:true
                    }),
                    Animated.timing(y,{
                        toValue:0,
                        duration:bump,
                        easing:Easing.linear,
                        useNativeDriver:true
                    }),
                    Animated.delay(total - bump*2 - bump *offset),
                ])
            )
            animation.start();
            return ()=>animation.stop();
        },[])
        const translateY = y.interpolate({
            inputRange:[0,1],
            outputRange:[0,-8]
        })
        return (
        <Animated.View
         style={[styles.typing,{transform:[{translateY}]}]}/>)
    }
    const MessageBubbleMe = ({content})=>{
        return (
            <View style={{flexDirection:'row',padding:4}}>
                <View style={{flex:1}}></View>
                <View style={[styles.containerMessage,{marginRight:8,backgroundColor:'#303040'}]}>
                <Text style={[styles.textMessage,{color:'white'}]}>{content}</Text>
                </View>
            </View>
        )
    }
    const MessageBubbleFriend = ({content='',typing=false})=>{
        return (<View style={{flexDirection:'row',padding:4,paddingLeft:12}}>
            <Image
                    source={utils.thumbnail(friend.thumbnail)}
                    style={styles.imageChat}
                />
            <View style={[styles.containerMessage,{marginLeft:8,backgroundColor:'#d0d2db'}]}>
                {typing?(
                <View style={{flexDirection:'row'}}>
                    <MessageTypingAnimation offset={0}/>
                    <MessageTypingAnimation offset={1}/>
                    <MessageTypingAnimation offset={2}/>
                </View>
                ):(content&&<Text 
                style={[styles.textMessage,{color:'#202020'}]}>{content}</Text>
                )}
            </View>
            </View>)
    }
    const MessageBubble = ({index,item})=>{
        console.log('Message Bubble',item);
        console.log('Index',index);
        const [showTyping, setShowTyping] = useState(false);
        const messagesTyping = useGlobal(state=>state.messagesTyping);

        useEffect(()=>{
            if(index!==0){
                return;
            }
            if(messagesTyping === null){
                setShowTyping(false);
                return;
            }
            setShowTyping(true);
            const check = setInterval(()=>{
                const now = new Date();
                const ms = now - messagesTyping;
                if(ms>10000){
                    setShowTyping(false);
                }
            },1000)
            return ()=>clearInterval(check);
        },[messagesTyping])
        if (index === 0 && showTyping) {
            return <MessageBubbleFriend typing={true} />;
        }
    
        return item.is_me ? (
            <MessageBubbleMe content={item.content} />
        ) : (
            item.content && <MessageBubbleFriend content={item.content} />
        );
    }

    const onSend= ()=>{
        console.log('Send Message',message.trim());
        if(!message.trim()){
            return;
        }
        console.log('Connection Id',connectionId);
        messageSend(connectionId,message);
        setMessage('');
    }
    const handleEndReached = () => {
        try{
            if (messagesNext && !loading) {
                setLoading(true);
                messageList(connectionId, messagesNext);
            }
        }
       catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };
    useLayoutEffect(() => {
        nav.setOptions({
            headerTitle: () => <MessageHeader friend={friend} />
        });
    }, []);
    useEffect(()=>{
        messageList(connectionId);
    },[])

    return (
        <View style={{ flex: 1 }}>
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
                <FlatList 
                style={{flex:1}}
                automaticallyAdjustKeyboardInsets={true}
                contentContainerStyle={{paddingTop:30}}
                onEndReached={handleEndReached}
                data={[{id:-1},...messagesList]} 
                renderItem={({item,index})=><MessageBubble index ={index}item={item} />}
                inverted={true}/>
            {/* </TouchableWithoutFeedback> */}
            <View style={{ paddingHorizontal :10,paddingBottom:10 ,backgroundColor:'white' ,flexDirection: 'row', alignItems: 'center' }}>
                <TextInput placeholder="Message ..." placeholderTextColor='#909090'
                value={message}
                onChangeText={onType}
                style={{
                    flex:1,
                    paddingHorizontal:18,
                    borderWidth:1,
                    borderRadius:25,
                    borderColor:'#d0d0d0',
                    height:60,
                    backgroundColor:'white'
                }}/>
                <TouchableOpacity style={{marginHorizontal:12}} onPress={onSend}>
                    <FontAwesomeIcon icon="paper-plane" color="#202020" size={24}  />
                </TouchableOpacity>
        </View>
        </View>
    );
};
const styles = StyleSheet.create({
    
    containerMessage:{
        maxWidth:'75%',
        paddingHorizontal:16,
        paddingVertical:12,
        justifyContent:'center',
        borderRadius:21,
        minHeight:42,
    },
    typing:{
        width:8,
        height:8,
        borderRadius:4,
        marginHorizontal:1.5,
        backgroundColor:'#606060'
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 90,
        alignSelf: 'center',
    },
    imageChat:{
        width: 40,
        height: 40,
        borderRadius: 90,
        alignSelf: 'center',
    },
    textMessage:{fontSize:16,lineHeight:18}
})
export default Message;