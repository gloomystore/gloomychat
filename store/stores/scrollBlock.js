const SCROLL_BLOCK = "SCROLL_BLOCK";
const SCROLL_STYLE = "SCROLL_STYLE";

// Action Creators
export const scrollBlock = (bool) => ({ type: SCROLL_BLOCK, bool });

// Initial State
const initialState = true;

// Reducer
const scroll = (state = initialState, action) => {
  switch (action.type) {
    case SCROLL_BLOCK:
      return action.bool;
    default:
      return state;
  }
};

export default scroll;