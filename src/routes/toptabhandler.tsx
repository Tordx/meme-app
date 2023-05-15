import { StyleSheet, Text, useColorScheme, View, Pressable, Animated } from 'react-native'
import React, { FC, useEffect,useRef } from 'react'
import { getFocusedRouteNameFromRoute, useRoute } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Home from '../pages/views/home'
import Hot from '../pages/views/hot'
import Issues from '../pages/views/issues'
import Satire from '../pages/views/satire'
import Videos from '../pages/views/videos'
import { Dark, cyan, light, lightgreen } from '../Assets/Colors'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Fontisto'

type Props = {
  route?: any,
}

const Toptabhandler: FC<Props> = (props: Props) => {
  const colorScheme = useColorScheme() === 'dark'
  const Tabs = createMaterialTopTabNavigator()
  const navigationBarRef = useRef(null);
  const translateY = new Animated.Value(0);
  const route = useRoute()

  const hideNavigationBar = () => {
    Animated.timing(translateY, {
      toValue: -75,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const showNavigationBar = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const getHeaderVisible = (route: any) => {
  
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  if (routeName !== 'Home' ) {
    hideNavigationBar();
  }
  return routeName === 'Home';
  }
  useEffect(() => {
    getHeaderVisible(route)
  }, [route]);

 
  return (
    <>
   <Animated.View
      ref={navigationBarRef}
      style={{
        transform: [{ translateY }],
        backgroundColor: colorScheme ? Dark : light,
        width: '100%',
        height: getHeaderVisible(route) ? 75:0,
        justifyContent: 'center',
      }}
    >
    {getHeaderVisible(route) &&
    <View>
      <Text
        style={{
          paddingLeft: 20,
          color: colorScheme ? light : cyan,
          fontSize: 50,
          fontFamily: 'Habesha',
          alignSelf: 'flex-start',
        }}
      >
        M04d
      </Text>
      <Pressable style={{ position: 'absolute', right: 20 }}>
        <FontAwesome name="user-circle" size={30} />
      </Pressable>
      </View>
      }
    </Animated.View>
    <Tabs.Navigator
    screenOptions={{
      
      tabBarBounces: true,
      tabBarShowLabel: false,
      tabBarStyle: { backgroundColor:  colorScheme ? Dark : light, borderColor: lightgreen },
      tabBarIconStyle: { height: 25, justifyContent: 'center', alignItems: 'center',},
      tabBarLabelStyle: { fontSize: 22,},
      tabBarActiveTintColor:  colorScheme ? lightgreen : cyan,
      tabBarIndicatorStyle: {backgroundColor: colorScheme ? lightgreen : cyan,}
    }}
    >
        <Tabs.Screen
            name = 'Home'
            component={Home}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <View style = {{flexDirection: 'row', width: 75, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',}}>
                <Icon name={focused ? "home": ""} size={18} color={color} />
                <Text style = {{marginLeft: focused ? 5 : 0, fontSize: 16, color: colorScheme ? light: Dark }}>Home</Text>
                </View>
              ),
            }}
        />
        <Tabs.Screen
          
          name = 'Videos'
          component={Videos}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style = {{flexDirection: 'row', width: 75, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',}}>
              <Icon name={focused ? "play": ""} size={18} color={color} />
              <Text style = {{marginLeft: focused ? 5 : 0, fontSize: 16, color: colorScheme ? light: Dark }}>Videos</Text>
              </View>
            ),
          }}

        />
        <Tabs.Screen
        
        name = 'Issues'
        component={Issues}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style = {{flexDirection: 'row', width: 75, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',}}>
            <Icon name={focused ? "fire": ""} size={20} color={color} />
            <Text style = {{marginLeft: focused ? 5 : 0, fontSize: 16, color: colorScheme ? light: Dark }}>Issues</Text>
            </View>
          ),
        }}

        />
        <Tabs.Screen
          
          name = 'Satire'
          component={Satire}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style = {{flexDirection: 'row', width: 75, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',}}>
              <Icon name={focused ? "laughing": ""} size={20} color={color} />
              <Text style = {{marginLeft: focused ? 5 : 0, fontSize: 16, color: colorScheme ? light: Dark }}>Satire</Text>
              </View>
            ),
          }}

        />
    </Tabs.Navigator>
    </>
  )
}

export default Toptabhandler