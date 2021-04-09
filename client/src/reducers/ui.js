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

const apiError = (state = null, action) => {
    switch (action.type) {
        case types.SET_API_ERROR:
            return action.error;
        default:
            return state;
    }
};

const apiSuccess = (state = null, action) => {
    switch (action.type) {
        case types.SET_API_SUCCESS:
            return action.message;
        default:
            return state;
    }
};

export default combineReducers({
    isLoading,
    apiError,
    apiSuccess
});