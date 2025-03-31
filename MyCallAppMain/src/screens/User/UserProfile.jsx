import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import useGlobal from '../../core/global';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import utils from '../../core/utils';


const ProfileLogout = () => {
    const logout = useGlobal(state=>state.logout);
    return (
        <TouchableOpacity onPress={logout}>
        <View style={styles.containerLogout}>
            <FontAwesomeIcon icon="sign-out-alt" color="white" size={20} />
            <Text style={styles.textLogout} >Logout</Text>
        </View>
        </TouchableOpacity>
    );
};

const ProfileImage = () => {
    const uploadThumbnail = useGlobal(state=>state.uploadThumbnail);
    const user = useGlobal(state=>state.user);
    console.log('User main',user)
    return (<TouchableOpacity onPress={()=>{
        launchImageLibrary({ includeBase64:true},(response)=>{
            console.log('LaunchImageLibrarys',response)
            if(response.didCancel)return;
            const file = response.assets[0];
            console.log(file.base64);
            uploadThumbnail(file);
            
        })
    }}>
        {user&&<Image
            source={utils.thumbnail(user.thumbnail)}
            style={styles.image}
            />}
        <View style={{ position:'absolute',bottom:0,right:0,width:40,height:40,alignItems:'center',justifyContent:'center',borderRadius:20,backgroundColor:'#202020'}}>
            <FontAwesomeIcon icon="pencil" color="#d0d0d0" size={20} />
        </View>
    </TouchableOpacity>)
            
}
const UserProfile = () => {
    const user =useGlobal(state=>state.user)
    return (
        <View style={styles.container}>
        <ProfileImage />
        {user && (
          <>
            <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
            <Text style={styles.username}>@{user.username}</Text>
          </>
        )}
        
        <ProfileLogout />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 90,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  username: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  containerLogout: {
    flexDirection: 'row',
    backgroundColor: '#202020',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    
  },
  textLogout: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Italic-VariableFont_wdth,wght',
    marginLeft: 15,
  },
});

export default UserProfile;
