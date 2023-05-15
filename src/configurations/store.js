import { configureStore } from '@reduxjs/toolkit'
import accountslice from './redux/accountslice'
import itemslice from './redux/itemslice'



export default configureStore({
    reducer: {

        user: accountslice,
        items: itemslice
    }
    
  })