import { StyleSheet, View, useColorScheme, Dimensions, FlatList, ViewToken, Button } from 'react-native';
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
  video: string;
  username: string;
  userimage: string;
  timestamp: Date;
}

const Videos = (props: Props) => {
  const colorScheme = useColorScheme() === 'dark';
  const [data, setdata] = useState<Document[]>([]);
  const [videoPaths, setVideoPaths] = useState<string[]>([]);
  const windowHeight = Dimensions.get('window').height;
  const flatListRef = useRef<FlatList<Document>>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);

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
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVideoPaths();
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems, changed }: { viewableItems: ViewToken[], changed: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setFocusedIndex(index);
    }
  });

  const renderVideoItem = ({ item, index }: { item: Document, index: number }) => {
    if (index !== focusedIndex) {
      return null; // Render null for non-focused items
    }

    return (
      <View style={[styles.videoContainer, { height: windowHeight }]}>
        <Video
          source={{ uri: item.video }}
          resizeMode="contain"
          playInBackground= {false}
          style={styles.backgroundVideo}
        />
      </View>
    );
  };

  const scrollToNextItem = () => {
    if (focusedIndex !== null && focusedIndex < data.length - 1) {
      const nextIndex = focusedIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setFocusedIndex(nextIndex);
    }
  };

  const scrollToPreviousItem = () => {
    if (focusedIndex !== null && focusedIndex > 0) {
      const previousIndex = focusedIndex - 1;
      flatListRef.current?.scrollToIndex({ index: previousIndex });
      setFocusedIndex(previousIndex);
    }
  };
  

  return (
    <View style={styles.container}>
      <FlatList
  
        onScroll={scrollToNextItem}
        ref={flatListRef}
        style={{ height: windowHeight }}
        data={data}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item._id}
        onViewableItemsChanged={onViewableItemsChanged.current}
        pagingEnabled
      />
       <Button title='prev ' onPress={scrollToPreviousItem}></Button>
      <Button title='next' onPress={scrollToNextItem}></Button>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});