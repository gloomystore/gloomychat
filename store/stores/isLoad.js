const LOAD = "LOAD";


// Action Creators
export const setContentLoad = (bool) => ({ type: LOAD, bool });

// Initial State
const initialState = false;

// Reducer
const load = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      return action.bool;
    default:
      return state;
  }
};


export default load;