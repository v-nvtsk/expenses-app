/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "../api/firebase/firebase";
import { Category, Filter } from "../api/expenses-api";
import { createDataTree } from "../helpers/list-to-tree";
import { treeToList } from "../helpers/tree-to-list";

export type CategoryState = {
  isLoading: boolean;
  items: Category[];
  errorState: string;
};

const initialState: CategoryState = {
  isLoading: false,
  items: [],
  errorState: "",
};

export const add = createAsyncThunk(
  "category/add",
  async (payload: { name: string; parentId: string }, { rejectWithValue }) => {
    try {
      const id = await firebase.create("category", payload);
      if (!id) throw new Error("Category is not created");
      return { ...payload, id };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const readAll = createAsyncThunk("category/readAll", async (payload: Filter, { rejectWithValue }) => {
  try {
    const objResult = await firebase.read("category", payload);
    const list = Object.entries(objResult).map(([key, value]) => ({ id: key, ...value }));

    const result = treeToList(createDataTree(list));
    return result as Category[];
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const categorySlice = createSlice({
  name: "category",
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
      .addCase(readAll.pending, (state) => {
        state.isLoading = true;
        state.errorState = "";
        state.items = [];
      })
      .addCase(readAll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(readAll.rejected, (state, action) => {
        state.isLoading = false;
        state.errorState = action.payload as string;
      });
  },
});
