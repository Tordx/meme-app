import { StyleSheet, Text, View, useColorScheme} from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { Dark, light } from '../Assets/Colors'

type Props = {}

interface CommentData {

  items: {
    ItemList:{
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
  }

}

const Comments = (props: Props) => {

  const colorScheme = useColorScheme() === 'dark';
  const {ItemList} = useSelector((action: CommentData) => action.items)
  console.log(ItemList);
  

  return (
    <View style = {[styles.commentcontainer, {backgroundColor: colorScheme ? Dark : light}]}>
      <Text>{ItemList.title}</Text>
    </View>
  )
}

export default Comments

const styles = StyleSheet.create({

  commentcontainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
  }

})