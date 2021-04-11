import { combineReducers } from "redux";
import * as types from "../actions/actionTypes";

const details = (state = {}, action) => {
    switch (action.type) {
        case types.SET_ADMIN_DETAILS:
            return action.admin;
        default:
            return state;
    }
};

export default combineReducers({
    details
});