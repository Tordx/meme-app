import { StyleSheet, Text, View, useColorScheme, Pressable } from 'react-native'
import React, {useState} from 'react'
import { launchImageLibrary } from 'react-native-image-picker'
import { Dark, light } from '../../Assets/Colors'                                                                                       
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs';
import { generateId } from '../../library/idgeneration';
import { dbMemevideo } from '../../database/database';
import { useSelector } from 'react-redux'

type Props = {}

interface userdata {
  user: {
    useraccount: {
      _id: string;
      _rev: string;
      username: string;
      userimage: string;
      firstname: string;
      lastname: string;
      password: string;
      userid: string;
      status: string;
      usertype: string;
    }
  }
}

const Createpost = (props: Props) => {

    const colorScheme = useColorScheme() === 'dark';
    const {useraccount} =  useSelector((action: userdata) => action.user)
    const [video, setvideo] = useState('');
    const date = new Date()
    const timestamp = date.getDate();

    const uploadVideo = async () => {
        const option = {
          mediaType: 'video' as string,
          quality: 1 as number,
          videoQuality: 'high' as string,
        };
        const id = generateId();
      
        launchImageLibrary(option as any, async (response) => {
          
          if (response.didCancel) {
            console.log('User cancelled video picker');
          } else if (response) {
            const file = response;
            console.log(file);
            
            try {
              
              const data = file?.assets?.[0]?.uri;
              console.log(data);
              const formData = new FormData();
              formData.append('video', {
                uri: data,
                type: 'video/mp4',
                name: 'video.mp4',
              });
              console.log(formData);
              const response = await fetch('https://api.imgur.com/3/upload', {
                method: 'POST',
                headers: {
                  'Authorization': 'Bearer bd49a5b019e13ffe584a4c735069141287166b0c',
                  'Content-Type': 'multipart/form-data',
                },
                body: formData,
              });
              const result = await response.json();
              console.log(result);
              const videolink = result.data.link
              const id = generateId()
              const newvideo = {
                _id: id,
                video: videolink,
                username: useraccount.username,
                userimage: useraccount.userimage,
                timestamp: timestamp,
              }
              await dbMemevideo.put(newvideo)
              console.log(newvideo);
              
            } catch (error) {
              console.log('Error uploading video:', error);
            }
          }
        });
      };
  return (
    <View style = {[styles.createpostcontainer, {backgroundColor: colorScheme ? Dark : light}]}>
      <Pressable onPress={uploadVideo}>
        <Text>createpost</Text>
      </Pressable>
    </View>
  )
}

export default Createpost

const styles = StyleSheet.create({

    createpostcontainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }

})