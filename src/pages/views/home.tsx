import { StyleSheet, Text, View, useColorScheme, ScrollView } from 'react-native'
import React from 'react'
import Homecontents from '../components/homecontents'
import { Dark, light } from '../../Assets/Colors'
import { Loginbutton } from '../../partials/Buttons'
import {InputBox, Write} from '../../partials/InputBox'
import Icon from 'react-native-vector-icons/MaterialIcons'

type Props = {}

const Home = (props: Props) => {

  const colorScheme = useColorScheme() === 'dark'
  return (
    <View style = {[styles.container, {backgroundColor: colorScheme ? Dark:light}]}>
      <View style = {styles.innercontainer}>
     <Homecontents/>
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({

 container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

  scrollview: {
    width: '100%',
    height: '100%',
    paddingTop: 10,

  },
  innercontainer: {
    
    width: '100%',
    height: '100%',
  }

})