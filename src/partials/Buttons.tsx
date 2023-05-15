import { View, Text, Pressable, StyleSheet, useColorScheme, ViewStyle } from 'react-native'
import React from 'react'
import { Dark, cyan, darkgreen, light, lightgreen, textdark, textlight } from '../Assets/Colors'
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type Props = {

    value?: boolean;
    titlesubject?: string;
    title?: string;
    onPress?: () => void;
    onValueChange?: (newValue: boolean) => void;
    name?: string;
    size?: number;
    color?: string;
    style?: ViewStyle;
}

export const Loginbutton = (props: Props) => {

    const colorScheme = useColorScheme() === 'dark';



    return (
        <Pressable style = {styles.loginbutton} onPress={props.onPress}>
        <Text style = {[styles.loginbuttontext, {color: colorScheme ?  light: Dark}]}>{props.title}</Text>
        </Pressable>
    )
}

export const Checkboxbutton = (props: Props) => {

    const colorScheme = useColorScheme() === 'dark';
    return (
        <View style = {styles.checkbox}>
            
            <CheckBox
                tintColor= {cyan}
                disabled={false}
                value={props.value}
                onValueChange={props.onValueChange}
            />
            <Text style = {[styles.checkboxtitle, {color: colorScheme ? textlight: textdark}]}>{props.title}<Text style = {{color: colorScheme ? lightgreen: darkgreen}}>{props.titlesubject}</Text></Text>
        </View>
    )
}

export const Textbutton = (props: Props) => {

    const colorScheme = useColorScheme() === 'dark';
    return (
        <Pressable style = {styles.textbutton}>
            <Text style = {styles.checkboxtitle}>{props.title}<Text style = {{color: colorScheme ? lightgreen: darkgreen}}>{props.titlesubject}</Text></Text>
        </Pressable>
    )
}

export const Iconbutton = (props: Props) => {

    return(
        <Pressable style = {props.style}
            onPress={props.onPress}
        >
        <Icon
        name = {props.name}
        size = {props.size}
        color = {props.color}


        />
    </Pressable>
    )
}

const styles = StyleSheet.create({

    textbutton: {

        marginTop: 10,
        borderBottomWidth: .5,

    },


    checkboxtitle:{

        fontSize: 12,
        fontFamily: 'Kondusif',


    },

    loginbutton: {
        width: '85%',
        height: 50,
        borderWidth: 2,
        borderRadius: 15,
        borderColor: cyan,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginbuttontext: {

        fontSize: 20,
        fontFamily: 'Kondusif'


    },
    checkbox: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
    }
})