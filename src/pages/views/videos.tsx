import { StyleSheet, View, useColorScheme, Dimensions, FlatList, ViewToken, Text, Pressable, Image } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { dbMemevideo } from '../../database/database';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import { Dark, light } from '../../Assets/Colors';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {};

interface VideoAttachment {
  content_type: string;
  revpos: number;
  digest: string;
  length: number;
  stub: boolean;
}

interface Document {
  _id: string;
  _rev: string;
  video: string;
  username: string;
  userimage: string;
  timestamp: Date;
}

const { width, height } = Dimensions.get('screen');

const Videos = (props: Props) => {
  const colorScheme = useColorScheme() === 'dark';
  const [paused, ispaused] = useState(false)
  const [data, setdata] = useState<Document[]>([]);
  const flatListRef = useRef<FlatList<Document>>(null);
  const videoRef = useRef<Video>(null);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!isFocused) {
      ispaused(true)
    }
  }, [isFocused]);

  const getVideoPaths = async () => {
    try {
      let result = await dbMemevideo.allDocs({
        include_docs: true,
        attachments: true,
      });

      if (result.rows) {
        let modifiedArr = result.rows.map((item: any) => item.doc);
        let filteredData = modifiedArr.filter((item: any) => item);

        if (filteredData.length > 0) {
          setdata(filteredData);
          console.log(filteredData);
          console.log('hello');
          
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVideoPaths();
  }, []);

  const renderVideoItem = ({ item, index }: { item: Document, index: number }) => {
    const itemHeight = Dimensions.get('window').height - insets.top - insets.bottom;
    return (
      <Pressable style={[styles.itemcontainer, { height: itemHeight, width: width,}]}
        onLongPress={() => ispaused(true)}
        delayLongPress={300}
        onPressOut={() => ispaused(false)}
      >
        
      <Video
          source={{ uri: item.video }}
          resizeMode="cover"
          paused = {paused}
          repeat = {true}
          focusable ={false}
          playInBackground= {false}
          style={styles.backgroundVideo}
        />
        <View style = {{position: 'absolute', right: 0}}>
          <Image source = {{uri: item.userimage}} resizeMode='cover' style = {{width: 50, height: 50}} />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colorScheme ? Dark : light}]}>
      
      <FlatList
  
        ref={flatListRef}
        style={{ height: height }}
        data={data}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item._id}
        snapToInterval={height}
        snapToAlignment="start"
        pagingEnabled
        showsVerticalScrollIndicator = {false}
      />
    </View>
  );
};

export default Videos;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemcontainer: {
    
    justifyContent: 'center',
    alignItems: 'center',

  },
  backgroundVideo: {
    position: 'absolute',
    width: width,
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});