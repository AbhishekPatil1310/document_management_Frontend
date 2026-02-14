import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  userId: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  bootstrapped: boolean;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  bootstrapped: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<AuthUser>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.bootstrapped = true;
    },
    clearAuthenticated(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.bootstrapped = true;
    },
    setBootstrapped(state) {
      state.bootstrapped = true;
    }
  }
});

export const { setAuthenticated, clearAuthenticated, setBootstrapped } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
