/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "../api/firebase/firebase";
import { Filter } from "../api/expenses.types";

export type Income = {
  id: string;
  creationDate: number;
  title: string;
  amount: number;
};

export type IncomeState = {
  isLoading: boolean;
  items: Income[];
  errorState: string;
};

const initialState: IncomeState = {
  isLoading: false,
  items: [],
  errorState: "",
};

export const add = createAsyncThunk("income/add", async (payload: Income, { rejectWithValue }) => {
  try {
    const id = await firebase.create("income", payload);
    if (!id) throw new Error("Income is not created");
    return { ...payload, id };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const read = createAsyncThunk("income/read", async (payload: Filter, { rejectWithValue }) => {
  try {
    const objResult = await firebase.read("income", payload);
    return Object.entries(objResult).map(([key, value]) => ({ id: key, ...value }));
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(add.pending, (state) => {
        state.errorState = "";
        state.isLoading = true;
      })
      .addCase(add.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(add.rejected, (state, action) => {
        state.isLoading = false;
        state.errorState = action.payload as string;
      })
      .addCase(read.pending, (state) => {
        state.errorState = "";
        state.isLoading = true;
      })
      .addCase(read.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.errorState = "";
      })
      .addCase(read.rejected, (state, action) => {
        state.isLoading = false;
        state.errorState = action.payload as string;
      });
  },
});
