import axios from "axios"

export const ADDRESS ='192.168.100.194:8000'
const BASE_URL = `http://${ADDRESS}/`
export const endpoints = {
    'login':'/o/token/',
    'register':'/users/',
    'users':'/users/',
    'current-user':'/users/current_user/',
}

export const authApis = (token)=>{
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
})