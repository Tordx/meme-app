import { StyleSheet, Text, View, useColorScheme} from 'react-native'
import React from 'react'

type Props = {}

const Satire = (props: Props) => {

    const colorScheme = useColorScheme() === 'dark'

  return (
    <View>
      <Text>satire</Text>
    </View>
  )
}

export default Satire

const styles = StyleSheet.create({



})