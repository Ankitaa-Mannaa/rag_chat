import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

export const uploadDocThunk = createAsyncThunk("docs/upload", async (file, { rejectWithValue }) => {
  try {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post("/api/documents/", form, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data; // expect { id, name, ... }
  } catch (e) {
    return rejectWithValue(e.response?.data?.msg || "Upload failed");
  }
});

export const listDocsThunk = createAsyncThunk("docs/list", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/api/documents/");
    return data; // expect array
  } catch (e) {
    return rejectWithValue(e.response?.data?.msg || "Fetch failed");
  }
});

const slice = createSlice({
  name: "documents",
  initialState: { items: [], loading: false, error: "", uploaded: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(uploadDocThunk.pending, (s)=>{ s.loading = true; s.error=""; s.uploaded=null; });
    b.addCase(uploadDocThunk.fulfilled, (s,a)=>{ s.loading=false; s.uploaded=a.payload; });
    b.addCase(uploadDocThunk.rejected, (s,a)=>{ s.loading=false; s.error=a.payload; });

    b.addCase(listDocsThunk.pending, (s)=>{ s.loading = true; s.error=""; });
    b.addCase(listDocsThunk.fulfilled, (s,a)=>{ s.loading=false; s.items=a.payload || []; });
    b.addCase(listDocsThunk.rejected, (s,a)=>{ s.loading=false; s.error=a.payload; });
  }
});

export default slice.reducer;
