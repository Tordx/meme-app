import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'

type Props = {}

const Videos = (props: Props) => {

    const colorScheme = useColorScheme() === 'dark'
  return (
    <View>
      <Text>videos</Text>
    </View>
  )
}

export default Videos

const styles = StyleSheet.create({})