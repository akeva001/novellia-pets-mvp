import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userReducer from "./userSlice";
import petsReducer from "./petsSlice";
import medicalRecordsReducer from "./medicalRecordsSlice";

// Define the root state type
const combinedReducer = combineReducers({
  user: userReducer,
  pets: petsReducer,
  medicalRecords: medicalRecordsReducer,
});

export type RootState = ReturnType<typeof combinedReducer>;

const rootReducer = (state: RootState | undefined, action: any) => {
  if (action.type === "user/signOut") {
    // Reset all slices to their initial states
    return combinedReducer(undefined, action);
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
