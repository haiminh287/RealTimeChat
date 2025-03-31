import { create } from "zustand";
import secure from './secure'
import { ADDRESS, authApis, endpoints } from "./apis";

// Socket receive

const reponseThumbnail = (set,get,data) => {
    set((state) => ({
        user:data
    }))
}

const responseRequestList = (set,get,data) => {
    set((state) => ({
        requestAcceptList:data
    }))
}

const responseMessageList = (set,get,data) => {
    const messagesList = [...get().messagesList,...data.messages];
    set((state) => ({
        messagesList:messagesList,
        messagesUsername: data.friend.username,
        messagesNext: data.next
    }))
}

const responseMessageSend = (set,get,data) => {
    console.log('MESSAGE',data.message);
    const username = data.friend.username
    const friendList = [...get().friendList];
    const friendIndex = friendList.findIndex(
        item => item.friend.username === username
    )
    if(friendIndex >= 0){
        const item = friendList[friendIndex];
        item.preview = data.message.content;
        item.updated_at = data.message.created_at;
        friendList.splice(friendIndex,1);
        friendList.unshift(item);
        set((state) => ({
            friendList:friendList
        }))
        if(username !== get().messagesUsername){
            return;
        }
        // friendList[friendIndex].unreadCount = 0;
    }
    const messagesList = [data.message,...get().messagesList];
    set((state) => ({
        messagesList:messagesList,
        messagesTyping: null
    }))

    
}
const responseRequestConnect = (set,get,connection) => {
    const user = get().user;
    if(user.username === connection.sender.username){
        return;
    }else{
        const requestAcceptList= [...get().requestAcceptList]
        const requestIndex = requestAcceptList.findIndex(
            request => request.sender.username === connection.sender.username
        )
        if(requestIndex === -1){
            requestAcceptList.unshift(connection);
            set((state)=>({
                requestAcceptList:requestAcceptList
            }))
        }
    }

}

const responseRequestAccept = (set,get,connection)=>{
    const user = get().user;
    if(user.username === connection.receiver.username){
        const requestAcceptList = [...get().requestAcceptList];
        const requestIndex = requestAcceptList.findIndex(
            request => request.id === connection.id
        )
        if(requestIndex >=0 -1){
            requestAcceptList.splice(requestIndex,1);
            set((state)=>({
                requestAcceptList:requestAcceptList
            }))
        }
    }
}

const responseMessageType = (set,get,data) => {
    if(data.username !== get().messagesUsername){
        return;
    }
    set((state) => ({
        messagesTyping : new Date()
    }))
}
const responseFriendList = (set,get,friendList)=>{
    set((state)=>({
        friendList:friendList
    }))
}

const responseFriendNew = (set,get,friend)=>{
    const friendList = [friend,...get().friendList];
    set((state)=>({
        friendList:friendList
    }))
}

const useGlobal =  create((set,get) => ({
    initialized: false,
    init: async ()=>{
        const credentials = await secure.get('credentials');
        console.log('CREDENTIALS',credentials);
        if(credentials){
            try{
                let res = await authApis(credentials.token).get(endpoints['current-user']);
                console.log(res.data);
                set((state) =>({
                    initialized: true,
                    authenticated: true,
                    user: res.data
                }))
                return
                }
                catch(e){
                    console.error(e);
                }
        }
        set((state) =>({
            initialized: true,
        }))
    },
    authenticated: false,
    user:{},
    login:(credentials,user)=>{
        secure.set('credentials',credentials);
        set((state) =>({
            authenticated: true,
            user: user
        }))
    },
    logout: ()=>{
        secure.wipe();
        set((state)=>({
            authenticated: false,
            user: {}
        }))
    },

    /// Websocket connection
    socket: null,
    socketConnect : async ()=>{
        const credentials = await secure.get('credentials');
        console.log('TOKENS',credentials.token);
        const token = credentials.token;
        console.log( `ws://${ADDRESS}/chat/?token=${token}`);
        const socket = new WebSocket( `ws://${ADDRESS}/chat/?token=${token}` );
        socket.onopen = () => {
            console.log('connected');
            socket.send(JSON.stringify({
                source: 'request.list',
            }))
            socket.send(JSON.stringify({
                source: 'friend.list',
            }))
        }
        socket.onmessage = (event) => {
            
            const parsed = JSON.parse(event.data);
            console.log('message',parsed);
            const responses = {
                'friend.list':responseFriendList,
                'friend.new':responseFriendNew,
                'message.list':responseMessageList,
                'message.send':responseMessageSend,
                'message.type':responseMessageType,
                'request.accept':responseRequestAccept,
                'request.list':responseRequestList,
                'request.connect':responseRequestConnect,
                'thumbnail': reponseThumbnail,
            }
            const response = responses[parsed.source];
            if(!response){
               console.error('No response for',parsed.source);
               return;
            }
            response(set,get,parsed.data);
        }
        socket.onerror = (e) => {
            console.log('error',e.message);
        }
        socket.onclose = () => {
            console.log('closed');
        }
        set((state) => ({
            socket: socket
        }))
    },

    socketClose: ()=>{
        const socket=  get().socket
        if(socket){
            socket.close();
        }
        set((state)=>({
            socket:null
        }))
    },


    /// Thumbnail
    thumbnail: null,
    uploadThumbnail: (file)=>{
        console.log(get().socket)
        const socket = get().socket;
        socket.send(JSON.stringify({
            source: 'thumbnail',
            base64: file.base64,
            filename: file.fileName,
        }))
    },

    // friendList
    friendList: null,


    // Connection
    requestList: null,
    requestConnect:(username)=>{
        const socket = get().socket;
        socket.send(JSON.stringify({
            source: 'request.connect',
            username : username,
        }))
    },

    // Send Message
    messageSend:(connectionId,message)=>{
        const socket = get().socket;
        socket.send(JSON.stringify({
            source: 'message.send',
            connectionId: connectionId,
            message:message,
        }))
    },

    messageType:(username)=>{
        const socket = get().socket;
        socket.send(JSON.stringify({
            source: 'message.type',
            username : username,
        }))
    },


    // List Message
    messagesUsername: null,
    messagesTyping: null,
    messagesNext: null,
    messagesList: [],
    messageList:(connectionId,page=0)=>{
        if(page === 0){
            set((state)=>({
                messagesList:[],
                messagesUsername: null,
                messagesTyping: null,    
                messagesNext: null,        
            }))
        }
        const socket = get().socket;
        socket.send(JSON.stringify({
            source: 'message.list',
            connectionId: connectionId,
            page: page
        }))
    },

    requestAcceptList: null,
    requestAccepted:(username)=>{
        const socket = get().socket;
        socket.send(JSON.stringify({
            source: 'request.accept',
            username : username,
        }))
    }
}))

export default useGlobal;