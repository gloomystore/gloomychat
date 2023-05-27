import { combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import load from "@/store/stores/isLoad";
import scroll from "@/store/stores/scrollBlock";

export const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default:
      return combineReducers({
        load,
        scroll,
      })(state, action);
  }
};

import { legacy_createStore as createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import thunk from "redux-thunk";
import { createWrapper } from "next-redux-wrapper";

const isProduction = process.env.NODE_ENV === "production";


const makeStore = () => {
  const enhancer = isProduction
    ? compose(applyMiddleware(thunk))
    : composeWithDevTools(applyMiddleware(thunk));
  const store = createStore(rootReducer, enhancer);
  return store;
};


const wrapper = createWrapper(makeStore, { debug: !isProduction });


export default wrapper;