import { combineReducers } from "redux";
import * as types from "../actions/actionTypes";

const usersData = (state = {users: [], allUsersCount: 0}, action) => {
    switch (action.type) {
        case types.SET_ADMIN_USERS:
            return action.usersData;
        default:
            return state;
    }
};

const currentUser = (state = {}, action) => {
    switch (action.type) {
        case types.SET_ADMIN_CURRENT_USER:
            return action.user;
        default:
            return state;
    }
};

export default combineReducers({
    usersData,
    currentUser
});