import { StyleSheet, View, useColorScheme, Dimensions, FlatList, ViewToken } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { dbMemevideo } from '../../database/database';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import { Dark, light } from '../../Assets/Colors';

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
  _attachments: {
    video: VideoAttachment;
  };
}

const Videos = (props: Props) => {
  const colorScheme = useColorScheme() === 'dark';
  const [data, setdata] = useState<Document[]>([]);
  const [videoPaths, setVideoPaths] = useState<string[]>([]);
  const windowHeight = Dimensions.get('window').height;
  const flatListRef = useRef<FlatList<Document>>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const getVideoPaths = async () => {
    try {
      let result = await dbMemevideo.allDocs({
        include_docs: true,
        attachments: true,
      });
  
      if (result.rows) {
        let modifiedArr = result.rows.map((item: any) => item.doc);
        let filteredData = modifiedArr.filter((item: any) => item._attachments);
  
        if (filteredData.length > 0) {
          setdata(filteredData);
  
      
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVideoPaths();
  }, []);

  const renderVideoItem = ({ item }: { item: Document }) => {
    const videoPath = videoPaths.find((path, index) => item._id === data[index]._id);

    if (!videoPath) {
      return null;
    }

    return (
      <View style={[styles.videoContainer, { height: windowHeight }]}>
        <Video
          source={{ uri: videoPath }}
          resizeMode="cover"
          style={styles.backgroundVideo}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        style={{ height: windowHeight }}
        data={data}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item._id}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 90,
        }}
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
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});