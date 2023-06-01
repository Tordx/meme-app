import { FlatList, Image, StyleSheet, Text, View, Share, Alert, Pressable , useColorScheme, Animated, Easing } from 'react-native'
import React, { useEffect, useState } from 'react'
import { dbMeme, dbMemevote } from '../../database/database'
import { Iconbutton, Loginbutton } from '../../partials/Buttons'
import { Dark, cyan, darkgreen, light, lightgreen, phdark, phlight, textdark, textlight } from '../../Assets/Colors'
import TimeAgo from 'react-native-timeago'
import { RefreshControl } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { generateId } from '../../library/idgeneration'
import { setItem } from '../../configurations/redux/itemslice'
import { useNavigation } from '@react-navigation/native'


type Props = {}

interface MemeData {
  _id: string,
  _rev: string,
  image: string
  video: string
  title: string
  description: string
  timestamp: string
  username: string
  userimage: string
  tag: string
  default: string
  status: string
  upvote: number
  downvote: number
  memeid: string
}

type userid = {
  user: {
    userid: string,
  }
}

interface votedata{
  _id: string,
  _rev?: string,
  memeid: string,
  userid: string,
  upvote: boolean,

}


const Homecontents = (props: Props) => {

  

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  }
  const {userid} =  useSelector((action: userid) => action.user)
  const  [refresh, setrefresh] = useState(false);
  const [data, setdata] = useState<MemeData[]>([]);
  const [firstItem, setFirstItem] = useState<MemeData | null>(null);
  const [likes, setlikes] = useState<votedata []>([]);
  const navigation = useNavigation();
  
  const colorScheme = useColorScheme() === 'dark';
  const dispatch = useDispatch()

  

  useEffect(() =>{
    getdata()
    userdataonvote()
  },[])
  
    const getdata = async() => {
      
        let result = await dbMeme.allDocs({
          include_docs: true,
          attachments: true,
        });
        if(result.rows){
          let modifiedArr = result.rows.map((item: any) => 
              item.doc
          )
          let filteredData = modifiedArr.filter((item: any) => {
          
            return item.default
          })
          
          setdata(filteredData);
          
        }

  }

  const userdataonvote = async() => {

    try {
      
      let result = await dbMemevote.allDocs({
        include_docs: true,
        attachments: true,
      });
      if(result.rows){
        let modifiedArr = result.rows.map((item: any) => 
            item.doc
        )
        let filteredData = modifiedArr.filter((item: any) => {
        
          return item.userid === userid
        })
        
        setlikes(filteredData);
        
        
      } 
    } catch (error) {
      console.error(error);
  }

  }

  
  const handleLike = async (item: MemeData) => {
    
    const id = generateId();

    try {
      const likingData = likes.find((like) => like.memeid === item.memeid);
      console.log(likingData);
  
      if (likingData) {
        console.log('this');
        
        if (likingData.upvote === true) {
          const doc = await dbMemevote.get(likingData._id);
          console.log(doc);
          await dbMemevote.put({
            _id: doc._id,
            _rev: doc._rev,
            userid: userid,
            memeid: item.memeid,
            upvote: false,
          });
  
          setlikes((prevLikes) =>
            prevLikes.map((like) =>
              like.memeid === item.memeid ? { ...like, upvote: false } : like
            )
          );
  
          setdata((prevData) =>
            prevData.map((meme) =>
              meme.memeid === item.memeid ? { ...meme, upvote: meme.upvote - 1 } : meme
            )
          );
        } else if (likingData.upvote === false) {
          const doc = await dbMemevote.get(likingData._id);
          await dbMemevote.put({
            _id: doc._id,
            _rev: doc._rev,
            userid: userid,
            memeid: item.memeid,
            upvote: true,
          });
  
          setlikes((prevLikes) =>
            prevLikes.map((like) =>
              like.memeid === item.memeid ? { ...like, upvote: true } : like
            )
          );
  
          setdata((prevData) =>
            prevData.map((meme) =>
              meme.memeid === item.memeid ? { ...meme, upvote: meme.upvote + 1 } : meme
            )
          );
        }
      } else {
        const newLike = {
          _id: id,
          userid: userid,
          memeid: item.memeid,
          upvote: true,
        };
  
        await dbMemevote.put(newLike);
        console.log(newLike);
        
        setlikes((prevLikes) => [...prevLikes, newLike]);
  
        setdata((prevData) =>
          prevData.map((meme) =>
            meme.memeid === item.memeid ? { ...meme, upvote: meme.upvote + 1 } : meme
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const forRefresh = () => {

    setrefresh(true)
    getdata()
    userdataonvote()
    setrefresh(false)
    
  }

  const renderItem = ({ item }: { item: MemeData }) =>{
  
    if (!firstItem) {
      setFirstItem(item);
    }
    return(

    <View style={styles.card}>
      <View>
        <View style = {styles.user}>
          <Image source={{uri: item.userimage as string || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}} style = {styles.userimage} resizeMode = 'cover' />
          <View style = {{flexDirection: 'column'}}>
            <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style = {[styles.username, {color: colorScheme ? textlight: textdark}]}>{item.username}</Text>
              <Text  style = {[styles.tag, {color: colorScheme ? lightgreen: darkgreen}]}> {item.tag}</Text>
              </View>
            <TimeAgo textStyle={{ color: colorScheme ? light : Dark }} time = {item.timestamp} />
          </View>
          <Iconbutton
            style = {{position: 'absolute', right: 0}}
            name = 'dots-horizontal'
            size = {30}
            color = {colorScheme? textlight: textdark}
          />
        </View>
        <View style = {styles.content}>
          <Text style = {[styles.description, {color: colorScheme ? light: Dark}]}>{item.description}</Text>
          {item.image as string && <Image source={{ uri: item?.image}} style = {styles.contentimage} resizeMode = 'contain' />}
        </View>
      </View>
      <View style = {styles.buttoncontainer}>
        <View style = {styles.buttons}>
          <Iconbutton
            onPress={() => {handleLike(item)}}
            name = {likes.find(vote => vote.memeid === item.memeid)?.upvote ? 'heart' : 'heart-outline'}
            size={35}
            color={likes.find(vote => vote.memeid === item.memeid)?.upvote ? (colorScheme ? lightgreen : cyan) : (colorScheme? textlight: textdark)}
          />
        </View>
        <Pressable style = {styles.buttons} >
          <Iconbutton
          onPress={() => {navigation.navigate('comments' as never); dispatch(setItem(item))}}
            name = 'comment-outline'
            size = {30}
            color = {colorScheme ? textlight: textdark}
          />
         <Text style = {[styles.buttoncontent, {color: colorScheme ? textlight: textdark}]}></Text>
        </Pressable>
        <View style = {styles.buttons}>
          <Iconbutton
            onPress={() => {}}
            name = 'hand-coin-outline'
            size = {30}
            color = {colorScheme ? textlight: textdark}
          />
         <Text style = {[styles.buttoncontent, {color: colorScheme ? textlight: textdark}]}></Text>
        </View>
        <View style = {styles.buttons}>
          <Iconbutton
            onPress={() => {}}
            name = 'share-outline'
            size = {30}
            color = {colorScheme ? textlight: textdark}
          />
         <Text style = {[styles.buttoncontent, {color: colorScheme ? textlight: textdark}]}></Text>
        </View>
      </View>
    </View>
  )}

  return (
    <View style = {{justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
      <FlatList
        showsVerticalScrollIndicator = {false}
        style={{ width: '100%', paddingTop: 10 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
        
          <RefreshControl
            progressBackgroundColor = {colorScheme ? Dark : light}
            refreshing = {refresh}
            onRefresh={forRefresh}
            colors = {[darkgreen, Dark, cyan]}
          />
        }
      />
    </View>
  )
}

export default Homecontents

const styles = StyleSheet.create({

  card: {
    width: '100%',
    padding: 20,
    borderBottomWidth: .5,
    borderColor: cyan,
    marginVertical: 2,
    flexDirection: 'column',
  },
  user:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  userimage: {
    width: 50,
    height: 50,
    borderRadius: 500,
    marginRight: 15,
  },
  content:{
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
    paddingVertical: 10,
  },
  contentimage: {

    alignSelf: 'center',
    width: '100%',
    height: 350,
    borderRadius: 5,
  },
  description: {
    fontSize: 16,

  },
  buttoncontainer: {

    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%'
  },
  buttons: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttoncontent:{

    marginHorizontal: 5,
    fontSize: 16,

  },
  reaction: {
    marginLeft: 20,
    fontSize: 16,
  },
  username: {
    fontSize: 16,
    borderRightWidth: 1,
    borderColor: lightgreen,
    paddingRight: 5,
    fontFamily: 'Kondusif',
    alignItems: 'center',
  },
  tag: {
    marginLeft: 2,
    fontSize: 13,
    fontFamily: 'Kondusif',

  }

})