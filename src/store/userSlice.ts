import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const USER_STORAGE_KEY = "@user_data";

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      // Store user data in AsyncStorage
      AsyncStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(action.payload)
      ).catch((error) => console.error("Error storing user data:", error));
    },
    signOut: (state) => {
      state.user = null;
      // Remove user data from AsyncStorage
      AsyncStorage.removeItem(USER_STORAGE_KEY).catch((error) =>
        console.error("Error removing user data:", error)
      );
    },
    restoreUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser, signOut, restoreUser } = userSlice.actions;

export default userSlice.reducer;
