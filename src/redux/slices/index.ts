// redux/slices/index.ts
import { combineReducers } from "@reduxjs/toolkit";
import profileReducer from "./profile-slice"

const rootReducer = combineReducers({
  profile: profileReducer,
});

export default rootReducer;
