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
    // const categories = [
    //   { id: "-NtlxhbAifMR93NOLL00", name: "Housing", parentId: "" },
    //   { id: "-NtlxkUB-qzpZaGzkBmZ", name: "Mortgage", parentId: "-NtlxhbAifMR93NOLL00" },
    //   { id: "-NtlxrwtGXx7r0-4JuL0", name: "Home maintenance", parentId: "-NtlxhbAifMR93NOLL00" },
    //   { id: "-NtlxuPjoTUIOEubNsC2", name: "Home improvement", parentId: "-NtlxhbAifMR93NOLL00" },
    //   { id: "-NtlxvhFCR787ozgqKEg", name: "Food", parentId: "" },
    //   { id: "-NtlxxwxfLFMFm5gq7pL", name: "Groceries", parentId: "-NtlxvhFCR787ozgqKEg" },
    //   { id: "-NtlxzvWA5yG-_cRJtNR", name: "Restaurants", parentId: "-NtlxvhFCR787ozgqKEg" },
    //   { id: "-Ntly0EsAiORiHmm1FTk", name: "Fast food", parentId: "-NtlxvhFCR787ozgqKEg" },
    //   { id: "-Ntly3Var2Ieo98-Fkat", name: "Coffee", parentId: "-NtlxvhFCR787ozgqKEg" },
    //   { id: "-Ntly4MH0NC9d797s9a4", name: "Alcohol", parentId: "-NtlxvhFCR787ozgqKEg" },
    //   { id: "-Ntly9H0Dtt_Rv8zxgwB", name: "Pets", parentId: "" },
    //   { id: "-NtlyCkUgg-u8SXiwLz7", name: "Pet food", parentId: "-Ntly9H0Dtt_Rv8zxgwB" },
    //   { id: "-NtlyEtPLaDRL24lm9KY", name: "Veterinary care", parentId: "-Ntly9H0Dtt_Rv8zxgwB" },
    // ];
    // const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
    // for (let i = 0; i < 1000; i += 1) {
    //   const year = random(2023, 2024);
    //   const month = random(0, 11);
    //   const date = random(1, 31);
    //   const categoryIndex = random(0, categories.length - 1);
    //   const requestOptions = {
    //     categoryId: categories[categoryIndex].id,
    //     creationDate: new Date(year, month, date).getTime(),
    //     title: `Expense for ${new Date(year, month, date)
    //      .toLocaleDateString()} category ${ categories[categoryIndex].name }`,
    //     amount: random(10000, 10000000),
    //   };
    //   firebase.create("expense", requestOptions);
    // }
    /* 

============


*/
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
