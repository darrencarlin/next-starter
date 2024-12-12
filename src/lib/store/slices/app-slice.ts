import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface AppState {
  isLoading: boolean;
}

export const initialState: AppState = {
  isLoading: false,
};

const app = createSlice({
  name: "app",
  initialState,
  reducers: {
    initialilzeApp: (state, action: PayloadAction<AppState>) => {
      state = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {initialilzeApp, setLoading} = app.actions;

export default app.reducer;
