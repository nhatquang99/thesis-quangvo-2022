import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { globalReducer } from "./reducers/globalReducer";
import { tokenReducer } from "./reducers/tokenReducer";

const reducer = combineReducers({
  globalReducer: globalReducer,
  tokenReducer: tokenReducer
});

const initialState = {

};
const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store
