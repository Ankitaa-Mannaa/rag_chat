import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

export const usageThunk = createAsyncThunk("usage/get", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/api/usage/");
    return data; // expect { questions_asked: number }
  } catch (e) {
    return rejectWithValue(e.response?.data?.msg || "Usage fetch failed");
  }
});

const slice = createSlice({
  name: "usage",
  initialState: { count: 0, loading: false, error: "" },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(usageThunk.pending, (s)=>{ s.loading=true; s.error=""; });
    b.addCase(usageThunk.fulfilled, (s,a)=>{ s.loading=false; s.count=a.payload?.questions_asked || 0; });
    b.addCase(usageThunk.rejected, (s,a)=>{ s.loading=false; s.error=a.payload; });
  }
});

export default slice.reducer;
