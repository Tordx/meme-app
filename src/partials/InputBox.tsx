import { Pressable, StyleSheet, TextInput, View, useColorScheme } from 'react-native'
import React from 'react'
import { Dark, cyan, light, phdark, phlight, textdark, textdefault, textlight } from '../Assets/Colors'
import { Iconbutton } from './Buttons'

type Props = {   
  placeholder?: string,
  value?: string,
  onChangeText?: (value: string) => void,
  secureTextEntry?: boolean,
  name?: string;
  size?: number;
  color?: string;
  onPress?: () => void;
}

export const InputBox = (props: Props) => {

  const colorScheme = useColorScheme() === 'dark';

  return (
    <View style = {[styles.inputcontainer, {borderColor: colorScheme ? cyan : Dark}]}>
      <TextInput
        placeholderTextColor={colorScheme ? phlight : phdark}
        style =  {[styles.textinput, {color: colorScheme ? textlight : textdark, fontSize: 16}]}
        value  = {props.value}
        secureTextEntry = {props.secureTextEntry}
        placeholder= {props.placeholder}
        onChangeText={props.onChangeText}
        autoCapitalize='none'
        autoComplete='off'
        autoCorrect= {false}
      />
      <Iconbutton
        style = {{position: "absolute", right: 15}}
        onPress={props.onPress}
        name = {props.name}
        size = {props.size}
        color = {props.color}
      />
    </View>
  )
}

export const Write = (props: Props) => {

  const colorScheme = useColorScheme() === 'dark';

  return (
  <Pressable style = {[styles.inputcontainer]}>
      <TextInput
        placeholderTextColor={colorScheme ? phlight : phdark}
        style =  {styles.textinput}
        value  = {props.value}
        secureTextEntry = {props.secureTextEntry}
        placeholder= {props.placeholder}
        onChangeText={props.onChangeText}
      />
    </Pressable>
  )

}

const styles = StyleSheet.create({

  inputcontainer: {
    width: '90%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    marginVertical: 5,
    borderRadius: 15,
  },
  textinput: {
    paddingLeft: 10,
    width: '100%',
    height: '100%',

  },
  writecontainer: {
    width: '90%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 15,
  }

})