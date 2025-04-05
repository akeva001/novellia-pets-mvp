import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MedicalRecord } from "../types";

interface MedicalRecordsState {
  records: MedicalRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicalRecordsState = {
  records: [],
  loading: false,
  error: null,
};

const medicalRecordsSlice = createSlice({
  name: "medicalRecords",
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<MedicalRecord[]>) => {
      state.records = action.payload;
    },
    addRecord: (state, action: PayloadAction<MedicalRecord>) => {
      state.records.push(action.payload);
    },
    updateRecord: (state, action: PayloadAction<MedicalRecord>) => {
      const index = state.records.findIndex(
        (record) => record.id === action.payload.id
      );
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    deleteRecord: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter(
        (record) => record.id !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRecords,
  addRecord,
  updateRecord,
  deleteRecord,
  setLoading,
  setError,
} = medicalRecordsSlice.actions;
export default medicalRecordsSlice.reducer;
