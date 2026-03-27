import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const tokenKey = "rag_token";

const initialToken = localStorage.getItem(tokenKey);
const initialUser = initialToken ? { token: initialToken } : null;

export const loginThunk = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    // Map frontend fields -> backend expected fields
    const { data } = await api.post("/api/authapp/login/", {
      username: payload.username,
      password: payload.password,
    });
    return data; // returns { access, refresh }
  } catch (e) {
    return rejectWithValue(e.response?.data?.detail || "Login failed");
  }
});

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/authapp/register/", payload);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data || { detail: "Registration failed" });
    }
  }
);

const slice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    loading: false,
    error: "",
  },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem(tokenKey);
    },
  },
  extraReducers: (b) => {
    b.addCase(loginThunk.pending, (s) => { s.loading = true; s.error = ""; });
    b.addCase(loginThunk.fulfilled, (s, a) => {
      s.loading = false;
      // store access token
      s.user = { token: a.payload.access };
      localStorage.setItem(tokenKey, a.payload.access);
    });
    b.addCase(loginThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Login failed"; });

    b.addCase(registerThunk.pending, (s) => { s.loading = true; s.error = ""; });
    b.addCase(registerThunk.fulfilled, (s) => { s.loading = false; });
    b.addCase(registerThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Registration failed"; });
  }
});

export const { logout } = slice.actions;
export default slice.reducer;
