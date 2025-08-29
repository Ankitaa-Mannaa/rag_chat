import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

export const usageThunk = createAsyncThunk("usage/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/api/usage/");
    return data; // now returns { today, remaining_today, month_to_date, last_24h }
  } catch (e) {
    return rejectWithValue(e.response?.data || "Failed to load usage");
  }
});

const slice = createSlice({
  name: "usage",
  initialState: {
    summary: null,
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(usageThunk.pending, (state) => { state.loading = true; state.error = ""; })
      .addCase(usageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload; // store full summary
      })
      .addCase(usageThunk.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (typeof payload === "object" && payload !== null) {
          state.error = payload.detail || JSON.stringify(payload);
        } else {
          state.error = payload || "Error";
        }
      });
  },
});

export default slice.reducer;
