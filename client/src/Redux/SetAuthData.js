import { createSlice } from "@reduxjs/toolkit";

const storedUserProfile = sessionStorage.getItem('userProfile');
const userProfile = storedUserProfile ? JSON.parse(storedUserProfile) : null;
const initialUserState = userProfile ? userProfile : { username: null, email: null, avatar:null };

export const authSlice = createSlice ({

    name:"gooleUserAuth",

    initialState: {
      email: initialUserState.Gmail,
      username: initialUserState.Gname,
      avatar: initialUserState.Gpic
    },

    reducers: {
      
      setEmail(state, action) {
        state.email = action.payload;
      },

      setUsername(state, action) {
        state.username = action.payload;
      },

      setPropic(state, action) {
        state.avatar = action.payload;
      },

    },
  });
  
// export all the actions so can call throughout the the application
export const { setEmail, setUsername, setPropic } = authSlice.actions;
export default authSlice.reducer;

