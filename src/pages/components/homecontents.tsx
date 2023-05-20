import { FlatList, Image, StyleSheet, Text, View, Share, Alert, Pressable , useColorScheme} from 'react-native'
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
  _rev: string,
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
  
    const getdata = async() => {
      
    try {
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
      } catch (error) {
        console.error(error);
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
        
          return item.memeid 
        })
        
        let newFilteredData = filteredData.filter((item: any) => {

          return item.userid === userid
        })
          
        let filteredvote = newFilteredData.filter((item: any) => {
          return item.upvote  === true
        })
        
        setlikes(filteredvote);
        
        
      } 
    } catch (error) {
      console.error(error);
  }

  }

  
  const handleLike = async (item: MemeData) => {

    try {
      const likingdata = likes && likes.find((likingdata) => likingdata.memeid === item.memeid);
      
      if (likingdata) {
        if (likingdata.upvote === true) {
          const getid = await dbMemevote.get(likingdata._id);
          const pushmedislike ={
            _id: getid._id,
            ...getid,
            upvote: false,
          };
          await dbMemevote.put(pushmedislike)
          const getmemeid = await dbMeme.get(item._id);
          const pushmemelike = {
            _id: item._id,
            ...getmemeid,
            upvote: item.upvote - 1,
          };
          await dbMeme.put(pushmemelike);
          getdata();
          userdataonvote();
        } else if (likingdata.upvote === false) {
          const getid = await dbMemevote.get(likingdata._id);
          const pushmedislike ={
            _id: getid._id,
            ...getid,
            upvote: true,
          };
          await dbMemevote.put(pushmedislike)
          const getmemeid = await dbMeme.get(item._id);
          const pushmemelike = {
            _id: item._id,
            ...getmemeid,
            upvote: item.upvote + 1,
          };
          await dbMeme.put(pushmemelike);
          getdata();
          userdataonvote();
        }
      } else {
          const id = generateId();
          await dbMemevote.put({
            _id: id,
            userid: userid,
            memeid: item.memeid,
            upvote: true,
          });
          const getmemeid = await dbMeme.get(item._id);
          const pushmemelike = {
            _id: item._id,
            ...getmemeid,
            upvote: item.upvote + 1,
          };
          await dbMeme.put(pushmemelike);
          getdata();
          userdataonvote();
      }
    } catch (error) {
      console.error(error);
    }
  };  


  useEffect(() =>{
    getdata()
    userdataonvote()
  },[])

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
            name = {likes.find(vote => vote.memeid === item.memeid)?.upvote ? 'thumb-up' : 'thumb-up-outline'}
            size = {35}
            color={likes.find(vote => vote.memeid === item.memeid)?.upvote ? (colorScheme ? lightgreen : cyan) : (colorScheme? textlight: textdark)}
          />
          <Text style = {[styles.reaction, {color: colorScheme ? textlight: textdark}]}>{item.upvote}</Text>
        </View>
        <Pressable style = {styles.buttons} onPress={() => {navigation.navigate('comments' as never); dispatch(setItem(item))}}>
          <Iconbutton
          
            name = 'comment-outline'
            size = {30}
            color = {colorScheme ? textlight: textdark}
          />
         <Text style = {[styles.buttoncontent, {color: colorScheme ? textlight: textdark}]}>Comments</Text>
        </Pressable>
        <View style = {styles.buttons}>
          <Iconbutton
            onPress={() => {}}
            name = 'share-outline'
            size = {30}
            color = {colorScheme ? textlight: textdark}
          />
         <Text style = {[styles.buttoncontent, {color: colorScheme ? textlight: textdark}]}>Share</Text>
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
  },
  description: {
    fontSize: 16,

  },
  buttoncontainer: {

    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '90%'
  },
  buttons: {
    marginRight: 10,
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