import { FlatList, Image, StyleSheet, Text, View, Share, Alert, ListRenderItem , useColorScheme} from 'react-native'
import React, { useEffect, useState } from 'react'
import { dbMeme, dbMemevote } from '../../database/database'
import { Iconbutton, Loginbutton } from '../../partials/Buttons'
import { Dark, cyan, darkgreen, light, lightgreen, phdark, phlight, textdark, textlight } from '../../Assets/Colors'
import TimeAgo from 'react-native-timeago'
import { RefreshControl } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import uuid from 'react-native-uuid'

type Props = {}
type MemeData = Record<string, unknown>;
type RootState = {
  user: {
    useraccount: {
      [key: string]: boolean | number | string;
    }[];
  };
};

const Homecontents = (props: Props) => {

  const {useraccount} = useSelector((action: RootState) => action.user)
  const  [refresh, setrefresh] = useState(false);
  const [data, setdata] = useState<MemeData[]>([]);
  const [memeid, setmemeid] = useState('');
  const [getvote, setgetvote] = useState('');
  const colorScheme = useColorScheme() === 'dark';
  const [upvote, setUpvoted] = useState(false);

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

          const memeid = filteredData[0].memeid
          
          setdata(filteredData);
          setmemeid(memeid)
          console.log('getdata');
          
          console.log(memeid)
          console.log(filteredData)
              
              
          
        } 
      } catch (error) {
        console.error(error);
    }

  }

  
  const getvotedata = async() => {

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
        
          return item.memeid === memeid
        })
        
        setgetvote(filteredData);
        console.log('votedata');
        
        console.log(filteredData)
            
            
        
      } 
    } catch (error) {
      console.error(error);
  }

  }


  useEffect(() =>{
    getdata()
    getvotedata()
    console.log('user account below');
    
    console.log(useraccount)
  },[])

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
  };
  const addvote = async () => {
    if (upvote) {
      // User has already upvoted, so unlike the meme
      const voteArray = Array.isArray(getvote) ? getvote : [];
      const filteredData = voteArray.filter((item: any) => item.useraccount === useraccount[0].useraccount);
      if (filteredData.length > 0) {
        await dbMemevote.remove(filteredData[0]._id, filteredData[0]._rev);
      }
    } else {
      // User has not upvoted, so like the meme
      const newVote = {
        _id: uuid.v4(),
        memeid: memeid,
        useraccount: useraccount[0].useraccount,
        upvote: true,
      };
      await dbMemevote.put(newVote);
    }
    setUpvoted(!upvote);
  };


  const forRefresh = () => {

    console.log('data-refresh');
    setrefresh(true)
    console.log('data-true');
    getdata()
    setrefresh(false)
    console.log('data-false');
  }

  const renderItem: ListRenderItem<MemeData> = ({ item }) => {

    return(

    <View style={styles.card}>
      <View>
        <View style = {styles.user}>
          <Image source={{uri: item.userimage as string || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}} style = {styles.userimage} resizeMode = 'cover' />
          <View style = {{flexDirection: 'column'}}>
            <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style = {[styles.username, {color: colorScheme ? textlight: textdark}]}>{item.username as string}</Text>
              <Text  style = {[styles.tag, {color: colorScheme ? lightgreen: darkgreen}]}> {item.tag as string}</Text>
              </View>
            <TimeAgo textStyle={{ color: colorScheme ? light : Dark }} time = {item.timestamp as number} />
          </View>
          <Iconbutton
            style = {{position: 'absolute', right: 0}}
            name = 'dots-horizontal'
            size = {30}
            color = {colorScheme? textlight: textdark}
          />
        </View>
        <View style = {styles.content}>
          <Text style = {[styles.description, {color: colorScheme ? light: Dark}]}>{item.description as string}</Text>
          {item.image as string && <Image source={{ uri: item?.image as string}} style = {styles.contentimage} resizeMode = 'contain' />}
        </View>
      </View>
      <View style = {styles.buttoncontainer}>
        <View style = {styles.buttons}>
          <Iconbutton
          onPress={addvote}
            name = 'thumb-up-outline'
            size = {35}
            color = {upvote  ? cyan : darkgreen }
          />
          <Text style = {[styles.buttoncontent, {color: colorScheme ? textlight: textdark}]}>123</Text>
        </View>
        <View style = {styles.buttons}>
          <Iconbutton
            name = 'comment-outline'
            size = {30}
            color = {colorScheme ? textlight: textdark}
          />
         <Text style = {[styles.buttoncontent, {color: colorScheme ? textlight: textdark}]}>Comments</Text>
        </View>
        <View style = {styles.buttons}>
          <Iconbutton
            onPress={onShare}
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
        keyExtractor={(item: MemeData) => item._id as string}
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