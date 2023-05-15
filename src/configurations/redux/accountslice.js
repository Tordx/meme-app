import { createSlice } from '@reduxjs/toolkit'

 export const Account = createSlice({
   name: 'Account',
   initialState: {
    useraccount: [],
    userview: [],
    approvingaccount: []
   },
   reducers: {
      setUserAccount: (state , action ) => {
        state.useraccount = action.payload
        console.log(action)
        console.log('UserAccountRedux')
 
      },
      setUserView: (state , action ) => {
        state.userview = action.payload
        console.log(action)
        console.log('UserViewRedux')
 
      },
      setApprovingAccoung: (state , action ) => {
        state.approvingaccount = action.payload
        console.log(action)
        console.log('ApprovingAccountRedux')
 
      },
  }
 })
 
 // Action creators are generated for each case reducer function
 export const {setUserAccount, setUserView , setApprovingAccoung} = Account.actions
 
 export default Account.reducer