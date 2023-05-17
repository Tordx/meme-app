import { createSlice } from '@reduxjs/toolkit'

 export const Account = createSlice({
   name: 'Account',
   initialState: {
    useraccount: [],
    userview: [],
    approvingaccount: [],
    userid: '',
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
      setuserid: (state, action ) => {
        state.userid = action.payload
        console.log(action)
        console.log('userid')
      }
  }
 })
 
 // Action creators are generated for each case reducer function
 export const {setUserAccount, setUserView , setApprovingAccoung, setuserid} = Account.actions
 
 export default Account.reducer