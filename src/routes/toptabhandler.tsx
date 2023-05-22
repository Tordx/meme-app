import { StyleSheet, Text, useColorScheme, View, Pressable, Animated, Image } from 'react-native'
import React, { FC, useEffect,useRef } from 'react'
import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Home from '../pages/views/home'
import Hot from '../pages/views/hot'
import Issues from '../pages/views/issues'
import Satire from '../pages/views/satire'
import Videos from '../pages/views/videos'
import { Dark, cyan, light, lightgreen, phdark, phlight, textdark, translucent } from '../Assets/Colors'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Fontisto'
import { useSelector } from 'react-redux'
import { Colors } from 'react-native/Libraries/NewAppScreen'

type Props = {
  route?: any,
}
interface userdata {
  user: {
    useraccount: {
      _id: string;
      _rev: string;
      username: string;
      userimage: string;
      firstname: string;
      lastname: string;
      password: string;
      userid: string;
      status: string;
      usertype: string;
    }
  }
}

const Toptabhandler: FC<Props> = (props: Props) => {
  
  const {useraccount} =  useSelector((action: userdata) => action.user)
  const colorScheme = useColorScheme() === 'dark'
  const Tabs = createMaterialTopTabNavigator()
  const navigationBarRef = useRef(null);
  const translateY = new Animated.Value(0);
  const route = useRoute()
  const navigation = useNavigation();

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
    <View style = {{alignItems: 'center', justifyContent: 'center',}}>
      <Text
        style={{
          paddingLeft: 20,
          color: colorScheme ? light : cyan,
          fontSize: 50,
          fontFamily: 'Habesha',
          alignSelf: 'flex-start',
        }}
      >
        thRift
      </Text>
      <View style={{ position: 'absolute', right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
      <Pressable style = {{ justifyContent: 'center', alignItems: 'center', marginRight: 10, width: 35, height: 35}} onPress={() => navigation.navigate('createpost' as never)}>
        <Icon
        name = 'plus-a' size={20} color={colorScheme ? phlight : phdark}
        />
      </Pressable>
      <Pressable style = {{ justifyContent: 'center', alignSelf: 'center'}}>
        <Image
          source = {{uri: useraccount.userimage}}
          style = {{width: 40, height: 40, borderRadius: 500, justifyContent: 'center', alignSelf: 'center'}} 
          resizeMode='cover'
        />
      </Pressable>
      </View>
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