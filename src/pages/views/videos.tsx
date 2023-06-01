import { StyleSheet, View, useColorScheme, Dimensions, FlatList, ViewToken, Text, Pressable, Image } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { dbMemevideo } from '../../database/database';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import { Dark, light } from '../../Assets/Colors';
import { useIsFocused } from '@react-navigation/native';

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
  const [videoPaths, setVideoPaths] = useState<Document | undefined>(undefined);
  const flatListRef = useRef<FlatList<Document>>(null);
  const videoRef = useRef<Video>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      // Pause the video when the screen loses focus
     ispaused(true)
    } else {
      // Resume or play the video when the screen gains focus
      ispaused(false)
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
          
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVideoPaths();
  }, []);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const videoPath = viewableItems[0].item.video;
        setVideoPaths(videoPath);
        console.log(videoPath);
        
      } else {
        setVideoPaths(undefined);
      }
    },
    []
  );

  const renderVideoItem = ({ item, index }: { item: Document, index: number }) => {

    return (
      <Pressable style={[styles.itemcontainer, { height: height, width: width,}]}
        onLongPress={() => ispaused(!paused)}
        delayLongPress={300}
        onPressOut={() => ispaused(false)}
      >
        <View style = {{position: 'absolute', right: 0}}>
          <Image source = {{uri: item.userimage}} resizeMode='cover' style = {{width: 50, height: 50}} />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colorScheme ? Dark : light}]}>
      
      <Video
          ref={videoRef}
          source={{ uri: videoPaths?.video }}
          resizeMode="cover"
          paused = {paused}
          repeat = {true}
          focusable ={false}
          playInBackground= {false}
          style={styles.backgroundVideo}
        />
      <FlatList
  
        ref={flatListRef}
        style={{ height: height }}
        data={data}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item._id}
        onViewableItemsChanged={handleViewableItemsChanged}
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
    flex: 1,
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
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});