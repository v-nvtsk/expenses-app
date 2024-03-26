import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firebase from "../api/firebase/firebase";
import { AuthData } from "../api/firebase";
import { APP_PREFIX } from "../api/expenses-api";

export type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: User;
  errorState?: string;
  refreshToken: string;
};

type User = AuthData;

type LoginPayload = {
  email: string;
  password: string;
};

const initialState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
  errorState: "",
  refreshToken: "",
};

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
  const token = localStorage.getItem(`${APP_PREFIX}@token`);
  try {
    if (!token) return rejectWithValue("token not found");
    const result = await firebase.renewAuth(token);
    if (!result) throw new Error("User not found");
    return result;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const signIn = createAsyncThunk("auth/login", async (payload: LoginPayload, { rejectWithValue }) => {
  try {
    const { email, password } = payload;
    const result = await firebase.signIn(email, password);
    if (!result) throw new Error("User not found");
    return result;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const signOut = createAsyncThunk("auth/logout", async (_payload, thunkAPI) => {
  thunkAPI.dispatch({ type: "logout/LOGOUT" });
  await firebase.signOut();
});

export const signUp = createAsyncThunk("auth/signUp", async (payload: LoginPayload, { rejectWithValue }) => {
  try {
    const { email, password } = payload;
    const result = await firebase.signUp(email, password);
    if (!result) throw new Error("User not registered");
    return result;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const resetPassword = createAsyncThunk(
  "@auth/resetPassword",
  async (payload: { email: string }, { rejectWithValue }) => {
    try {
      const { email } = payload;
      const result = await firebase.resetPassword(email);
      if (!result) throw new Error("Password reset is not possible");
    } catch (e: any) {
      return rejectWithValue(e.message);
    }

    return null;
  },
);

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state: AuthState) => {
        const authState = state;
        authState.isLoading = true;
        authState.errorState = "";
      })
      .addCase(signIn.fulfilled, (state: AuthState, { payload }) => {
        const authState = state;
        authState.isLoading = false;
        authState.isAuthenticated = true;
        authState.user = payload as User;
        localStorage.setItem(`${APP_PREFIX}@token`, payload.refreshToken);
      })
      .addCase(signIn.rejected, (state: AuthState, { payload }) => {
        const authState = state;
        authState.isLoading = false;
        authState.errorState = payload as string;
        authState.isAuthenticated = false;
        authState.user = undefined;
      })
      .addCase(signOut.pending, (state: AuthState) => {
        const authState = state;
        authState.isLoading = true;
        authState.isAuthenticated = false;
        authState.user = undefined;
        authState.errorState = "";
      })
      .addCase(signOut.fulfilled, (state: AuthState) => {
        const authState = state;
        authState.isLoading = false;
        localStorage.removeItem(`${APP_PREFIX}@token`);
      })
      .addCase(signUp.pending, (state: AuthState) => {
        const authState = state;
        authState.isLoading = true;
        authState.isAuthenticated = false;
        authState.errorState = "";
      })
      .addCase(signUp.fulfilled, (state: AuthState, action: PayloadAction<AuthData>) => {
        const authState = state;
        authState.isLoading = false;
        authState.isAuthenticated = true;
        authState.user = action.payload;
        localStorage.setItem(`${APP_PREFIX}@token`, action.payload.refreshToken);
      })
      .addCase(signUp.rejected, (state: AuthState, action) => {
        const authState = state;
        authState.isLoading = false;
        authState.errorState = action.payload as string;
        authState.isAuthenticated = false;
        authState.user = {} as User;
      })
      .addCase(checkAuth.pending, (state: AuthState) => {
        const authState = state;
        authState.isLoading = true;
        authState.isAuthenticated = false;
        authState.errorState = "";
      })
      .addCase(checkAuth.fulfilled, (state: AuthState, action: PayloadAction<AuthData>) => {
        const authState = state;
        authState.isLoading = false;
        authState.isAuthenticated = true;
        authState.user = action.payload;
        localStorage.setItem(`${APP_PREFIX}@token`, action.payload.refreshToken);
      })
      .addCase(checkAuth.rejected, (state: AuthState) => {
        const authState = state;
        authState.isLoading = false;
        authState.isAuthenticated = false;
        authState.user = {} as User;
        localStorage.removeItem(`${APP_PREFIX}@token`);
      })
      .addCase(resetPassword.pending, (state: AuthState) => {
        const authState = state;
        authState.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state: AuthState) => {
        const authState = state;
        authState.isLoading = false;
        authState.errorState = "";
      })
      .addCase(resetPassword.rejected, (state: AuthState, action) => {
        const authState = state;
        authState.isLoading = false;
        authState.errorState = action.payload as string;
      });
  },
});
