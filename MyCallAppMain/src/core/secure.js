import EncryptedStorage from "react-native-encrypted-storage";

const set = async (key, object) => {
    try{
        await EncryptedStorage.setItem(key,JSON.stringify(object));
    }
    catch(e){
        console.error('secure.set',e);
    }
}

const get = async (key) => {
    try{
        let res = await EncryptedStorage.getItem(key);
        if(res!==undefined)
            return JSON.parse(res);
    }
    catch(e){
        console.error('secure.get',e);
    }
}

const remove = async (key) => {
    try{
        await EncryptedStorage.removeItem(key);
    }
    catch(e){
        console.error('secure.remove',e);
    }
}

const wipe = async ()=>{
    try{
        await EncryptedStorage.clear();
    }
    catch(e){
        console.error('secure.wipe',e);
    }
}

export default {set,get,remove,wipe};