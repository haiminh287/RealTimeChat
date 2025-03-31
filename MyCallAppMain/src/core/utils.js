import { ADDRESS } from "./apis";
import ProfileImage from '../assets/profile.png'
const log = (...args) => {
    args.forEach(arg => {
        if (typeof arg === 'object') {
            arg = JSON.stringify(arg, null, 2);
        }
        console.log(arg);
    });
};

const thumbnail = (url)=>{
    if(!url){
        return ProfileImage;
    }
    return {
        uri:'http://'+ADDRESS+'/static'+url
    }
}
export default { log,thumbnail };


