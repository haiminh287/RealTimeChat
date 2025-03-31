
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';

import Home from './src/screens/Home/Home';
import { NavigationContainer,DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './src/screens/Home/Splash';
import Register from './src/screens/User/Register';
import Login from './src/screens/User/Login';
import Message from './src/screens/Home/Message';
import Search from './src/screens/Home/Search';
import Title from './src/common/Title';
// import 'moment/locale/vi';
import './src/core/fontawesome'
import useGlobal from './src/core/global';
import CallScreen from './src/components/CallScreen';

const Stack = createNativeStackNavigator();

const LightThemoe = {
  ...DefaultTheme,
  colors:{
    ...DefaultTheme.colors,
    background: 'white'
  }
}

function App() {
  const initialized = useGlobal(state=>state.initialized);
  const authenticated = useGlobal(state=>state.authenticated);
  const init = useGlobal(state=>state.init);
  useEffect(()=>{
    init();
  },[])
  
  return (
    <NavigationContainer theme={LightThemoe}>
      <StatusBar barStyle='dark-content' />
      <Stack.Navigator>
        {!initialized ? (
          <>
          <Stack.Screen name="Splash" component={Splash} />
          </>
        ): !authenticated ?(
          <>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        </>
        ):(
          <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Message" component={Message} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Call" component={CallScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;
