import { Alert, Image, ImageBackground, StatusBar, StyleSheet, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Dark, alertcolor, cyan, darkgreen, light, lightgreen, phlight, textdark, warningcolor } from '../Assets/Colors';
import {InputBox} from '../partials/InputBox';
import { Checkboxbutton, Loginbutton, Textbutton } from '../partials/Buttons';
import darkbackground from '../Assets/Images/background-image.png';
import lightbackground from '../Assets/Images/background-image-1.png';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { dbMemeaccount } from '../database/database';
import { setUserAccount, setuserid } from '../configurations/redux/accountslice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loadingmodal from '../partials/loadingmodal';

const Login = () => {

  const colorScheme = useColorScheme() === 'dark';
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [checkmark, setCheckMark] = useState(true);
  const [visible, setvisible] = useState(false);
  const [openmodal, setopenmodal] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const background = colorScheme ? darkbackground : lightbackground;
  
  const userdata = async() => {
    setopenmodal(true)
    try {
      let result = await dbMemeaccount.allDocs({
        include_docs: true,
        attachments: true,
      });
      if(result.rows){
        let modifiedArr = result.rows.map((item: any) => 
            item.doc
        )
        let filteredData = modifiedArr.filter((item: any) => {
        
          return item.username = username.toString()
        })
        if (filteredData.length) {
          let newFilterData = filteredData.map((item: any) => {
            return item
          });
          const FullDetails = newFilterData[0]
            const newusername = newFilterData[0].username
            const newpassword = newFilterData[0].password
            const userid = newFilterData[0].userid
            const usertype = newFilterData[0].usertype
            const status = newFilterData[0].status
          if(newusername === username && newpassword === password) {
            if(status !== "Active"){
              Alert.alert('Account is not active', ' Please contact your moderators for more Info')
              setopenmodal(false)
              return;
            } else {
              if(usertype === "user") {
                navigation.navigate('toptabhandler' as never);
                await AsyncStorage.setItem('userCredentials', JSON.stringify(FullDetails));
                dispatch(setUserAccount(FullDetails));
                dispatch(setuserid(userid));
                setusername('')
                setpassword('')
                setopenmodal(false)
              } 
              if(usertype === "admin") {
                await AsyncStorage.setItem('userCredentials', JSON.stringify(FullDetails));
                dispatch(setUserAccount(FullDetails));
                // setLoading(false)
                setusername('')
                setpassword('')
                // navigation.navigate('Toptabs');
              }
            }
          } else {
            Alert.alert('Whoooooops!', "something went wrong or your username & password didn't match our system")
            setopenmodal(false)
          }
        } else {
          Alert.alert('Username not found', "The username you entered doesn't exist in our system. Please try again.")
          setopenmodal(false)
        }
      }
    } catch (error) {
      console.error(error);
  }


  }

  return (
    <ImageBackground source={background}  style = {styles.container} resizeMode='cover'>
      
      <View style  = {styles.container}>
        <InputBox
          placeholder='username'
          value = {username}
          onChangeText={(value) => {setusername(value)}}
          secureTextEntry = {false}
          name = 'close-circle'
          onPress={() => setusername('')}
          size = {20}
          color= {username ? 'red' : '#808080'}

        />
        <InputBox
          placeholder='password'
          value = {password}
          onChangeText={(value) => {setpassword(value)}}
          secureTextEntry = {visible}
          onPress={() => setvisible(!visible)}
          name = {visible ? 'eye' : 'eye-off'}
          size = {25}
          color= {colorScheme? cyan : darkgreen}

        />
        <Textbutton
        title = 'forgot password'
        />
        <Loginbutton
          title = 'SIGN IN'
          onPress={userdata}
        />
        <Checkboxbutton
          value = {checkmark}
          onValueChange={() => setCheckMark(!checkmark)}
          title = 'By logging in, you agree to our'
          titlesubject=' Terms of use and Conditions'
        />
      </View>
      <Loadingmodal
      visible = {openmodal}
      />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
      width: '75%',
      height: 100,
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
    }
})

export default Login;
