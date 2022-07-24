const { configureStore } = require("@reduxjs/toolkit");
import listNodeArray from "../database/firestoreDao";

const rootReducer = {
  dataPerson: listNodeArray,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
