import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'

type Props = {}

const Hot = (props: Props) => {

    const colorScheme = useColorScheme() === 'dark'
  return (
    <View>
      <Text>Hot</Text>
    </View>
  )
}

export default Hot

const styles = StyleSheet.create({})