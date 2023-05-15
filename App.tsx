import { View, Text } from 'react-native'
import React from 'react'
import { StackHandler } from './src/routes/stackhandler'
import { Provider } from 'react-redux'
import store from './src/configurations/store'

type Props = {


}

const App = (props: Props) => {
  return (
    <Provider store ={store}>
    <StackHandler/>
    </Provider>

  )
}

export default App