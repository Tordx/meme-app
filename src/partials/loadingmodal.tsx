import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Dark, darkgreen, light, translucent, transparent } from '../Assets/Colors';

type Props = {
    visible?: boolean;
}

const Loadingmodal = (props: Props) => {
  return (
    <Modal
    visible = {props.visible}
    transparent
    statusBarTranslucent
    
    >
      <View style = {{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: translucent}}>
        <View style = {{width: '80%', height: '10%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', elevation: 5, backgroundColor: light, borderRadius: 15}}>
            <ActivityIndicator size='large' color={darkgreen} />
            <Text style = {{marginLeft: 20, textAlign: 'center', color: Dark}}>Signing In, Please wait</Text>
        </View>
      </View>
    </Modal>
  )
}

export default Loadingmodal

const styles = StyleSheet.create({})