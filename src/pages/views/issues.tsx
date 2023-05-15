import { StyleSheet, Text, View, useColorScheme} from 'react-native'
import React from 'react'

type Props = {}

const Issues = (props: Props) => {

  const colorScheme = useColorScheme() === 'dark'
  
  return (
    <View>
      <Text>issues</Text>
    </View>
  )
}

export default Issues

const styles = StyleSheet.create({})