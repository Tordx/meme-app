import { createSlice } from '@reduxjs/toolkit'

 export const Item = createSlice({
   name: 'Item',
   initialState: {
    ItemList: [],
   },
   reducers: {
      setItem: (state , action ) => {
        state.ItemList = action.payload
        console.log(action)
        console.log('action')
      },
 
   }
 })
 
 // Action creators are generated for each case reducer function
 export const {setItem} = Item.actions
 
 export default Item.reducer