import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

export const searchThunk = createAsyncThunk("qa/search", async (query, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/api/search/", { query });
    return data; // expect [{chunk, score, doc_id}, ...] or similar
  } catch (e) {
    return rejectWithValue(e.response?.data?.msg || "Search failed");
  }
});

export const answerThunk = createAsyncThunk("qa/answer", async (query, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/api/answer/", { query });
    return data; // expect { answer, sources: [...] }
  } catch (e) {
    return rejectWithValue(e.response?.data?.msg || "Answer failed");
  }
});

const slice = createSlice({
  name: "qa",
  initialState: {
    query: "",
    results: [],
    answer: "",
    sources: [],
    loading: false,
    error: "",
  },
  reducers: {
    setQuery(state, action) { state.query = action.payload; }
  },
  extraReducers: (b) => {
    b.addCase(searchThunk.pending, (s)=>{ s.loading=true; s.error=""; s.results=[]; });
    b.addCase(searchThunk.fulfilled, (s,a)=>{ s.loading = false; s.results = a.payload?.results || []; });
    b.addCase(searchThunk.rejected, (s,a)=>{ s.loading=false; s.error=a.payload; });

    b.addCase(answerThunk.pending, (s)=>{ s.loading=true; s.error=""; s.answer=""; s.sources=[]; });
    b.addCase(answerThunk.fulfilled, (s,a)=>{ s.loading=false; s.answer=a.payload?.answer || ""; s.sources=a.payload?.sources || []; });
    b.addCase(answerThunk.rejected, (s,a)=>{ s.loading=false; s.error=a.payload; });
  }
});

export const { setQuery } = slice.actions;
export default slice.reducer;
