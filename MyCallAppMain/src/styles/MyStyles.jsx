import { StyleSheet } from "react-native";

export default  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'black',
    },
    textTitle : {
    color: 'white',
    fontSize: 40,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily:'LeckerliOne-Regular',
    },
    titleInput:{ color: '#70747a', marginVertical: 6, paddingLeft: 16 },
    textInput: {
      color: 'black',
        fontSize: 20,
        // fontWeight: 'bold',
        // fontFamily:'LeckerliOne-Regular',
        backgroundColor: '#e1e2e4',
        paddingHorizontal: 20,
        borderRadius: 26,
    },
    margin:{
      margin:10
    }
  });
