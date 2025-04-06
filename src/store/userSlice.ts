import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";
import { AppThunk, AppDispatch } from "./index";
import { clearData as clearPetsData } from "./petsSlice";
import { setPets } from "./petsSlice";
import * as api from "../api/client";

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      if (action.payload) {
        AsyncStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    signOut: (state) => {
      state.user = null;
      AsyncStorage.removeItem("user");
    },
  },
});

export const { setUser } = userSlice.actions;

export const signOut =
  (): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
    dispatch(userSlice.actions.signOut());
    dispatch(clearPetsData());
  };

export const restoreUser =
  (): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        dispatch(setUser(user));

        try {
          const pets = await api.getPets(user.id);
          dispatch(setPets(pets));
        } catch (error) {
          console.error("Error fetching pets during restore:", error);
        }
      }
    } catch (error) {
      console.error("Error restoring user:", error);
    }
  };

export default userSlice.reducer;
