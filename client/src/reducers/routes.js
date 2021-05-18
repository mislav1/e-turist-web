import { combineReducers } from "redux";
import * as types from "../actions/actionTypes";

const routesData = (state = {routes: [], allRoutesCount: 0}, action) => {
    switch (action.type) {
        case types.SET_ADMIN_ROUTES:
            return action.routesData;
        default:
            return state;
    }
};

const currentRoute = (state = {}, action) => {
    switch (action.type) {
        case types.SET_ADMIN_CURRENT_ROUTE:
            return action.route;
        default:
            return state;
    }
};

export default combineReducers({
    routesData,
    currentRoute
});