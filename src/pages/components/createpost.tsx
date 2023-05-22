import { StyleSheet, Text, View, useColorScheme, Pressable } from 'react-native'
import React, {useState} from 'react'
import { launchImageLibrary } from 'react-native-image-picker'
import { Dark, light } from '../../Assets/Colors'                                                                                       
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs';
import { generateId } from '../../library/idgeneration';
import { dbMemevideo } from '../../database/database';

type Props = {}


const Createpost = (props: Props) => {

    const colorScheme = useColorScheme() === 'dark';
    const [video, setvideo] = useState('');

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
            try {
              const data = file?.assets?.[0]?.uri;
              console.log(data);
              const videoBlob = await RNFetchBlob.fs.readFile(data as string, 'base64');
              const doc = {
                _id: id,
                _attachments: {
                  video: {
                    content_type: data,
                    data: videoBlob,
                  },
                },
              };
              console.log(videoBlob)
              await dbMemevideo.put(doc);
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