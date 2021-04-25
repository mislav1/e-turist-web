import { combineReducers } from "redux";
import * as types from "../actions/actionTypes";

const adminsData = (state = {admins: [], allAdminsCount: 0}, action) => {
    switch (action.type) {
        case types.SET_ADMIN_ADMINS:
            return action.adminsData;
        default:
            return state;
    }
};

export default combineReducers({
    adminsData
});