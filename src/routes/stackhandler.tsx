import { View, Text, StatusBar, useColorScheme } from 'react-native'
import React, {FC} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../pages/login';
import { Dark, light, white } from '../Assets/Colors';
import Toptabhandler from './toptabhandler';
import Comments from '../partials/comments';

type Props = {

    name?: (value: string) => void;

}
export const StackHandler: FC<Props> = (props: Props) => {

    const colorScheme = useColorScheme() === 'dark';
    const Stack = createStackNavigator();

    return (
    <NavigationContainer>
         <StatusBar
         backgroundColor={colorScheme? Dark : light} barStyle = {colorScheme ? 'light-content': 'dark-content'} 
         />
        <Stack.Navigator screenOptions={{gestureVelocityImpact: 0.1,}}>
            <Stack.Screen
                name = 'login' 
                component={Login} 
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name = 'toptabhandler' 
                component={Toptabhandler} 
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
             name = 'comments' 
             component={Comments} 
             options={{
                 headerShown: false
             }}
            />
        </Stack.Navigator>
    </NavigationContainer>
    );
};