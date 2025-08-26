import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import docReducer from "./slices/docSlice";
import qaReducer from "./slices/qaSlice";
import usageReducer from "./slices/usageSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    documents: docReducer,
    qa: qaReducer,
    usage: usageReducer,
  },
});

export default store;
