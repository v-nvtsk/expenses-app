/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "../api/firebase/firebase";
import { Filter } from "../api/expenses-api";

export type Expense = {
  id: string;
  categoryId: string;
  creationDate: number;
  title: string;
  amount: number;
};

export type ExpenseState = {
  isLoading: boolean;
  items: Expense[];
  errorState: string;
};

const initialState: ExpenseState = {
  isLoading: false,
  items: [],
  errorState: "",
};

export const add = createAsyncThunk("expense/add", async (payload: Expense, { rejectWithValue }) => {
  try {
    const id = await firebase.create("expense", payload);
    if (!id) throw new Error("Expense is not created");
    return { ...payload, id };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const read = createAsyncThunk("expense/read", async (payload: Filter, { rejectWithValue }) => {
  try {
    const objResult = await firebase.read("expense", payload);
    const result = Object.entries(objResult).map(([key, value]) => ({ ...value, id: key }));
    return result.sort((a, b) => a.creationDate - b.creationDate);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const expenseSlice = createSlice({
  name: "expense",
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
