import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user:null,
   
};



//yaha pe aisa ho raha tha n ki pehle me are data ko null mark kara 
// Problem: Page refresh pe user null ho ja raha tha
// Is wajah se login/signup button ya dashboard dropdown dikh nahi raha tha
// Reason: Redux state empty ho jaati hai refresh ke baad

// Solution: localStorage se user aur token get kar lo
// agar value mile toh use set karo, warna null raho



const profileSlice = createSlice({
    name: "profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
    },
});

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;