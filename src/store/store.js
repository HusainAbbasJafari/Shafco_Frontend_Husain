import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import authReducer from "./slices/authSlice";
import apiReducer from "./slices/apiSlice";
import generalReducer from "./slices/generalSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],  // only persist auth slice
};

const rootReducer = combineReducers({
  auth: authReducer,
  api: apiReducer,
  general: generalReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // to avoid redux-persist warnings
    }),
});

export const persistor = persistStore(store);

export default store;
