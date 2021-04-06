import { combineReducers } from "redux";
import * as types from "../actions/actionTypes";

const isLoading = (state = false, action) => {
    switch (action.type) {
        case types.SET_LOADING:
            return action.loading;
        default:
            return state;
    }
};

export default combineReducers({
    isLoading,
});