import { combineReducers } from "redux";
import * as types from "../actions/actionTypes";

const destinationsData = (state = {destinations: [], allDestinationsCount: 0}, action) => {
    switch (action.type) {
        case types.SET_ADMIN_DESTINATIONS:
            return action.destinationsData;
        default:
            return state;
    }
};

export default combineReducers({
    destinationsData
});