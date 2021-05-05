import { combineReducers } from "redux";
import * as types from "../actions/actionTypes";

const citiesData = (state = {cities: [], allCitiesCount: 0}, action) => {
    switch (action.type) {
        case types.SET_ADMIN_CITIES:
            return action.citiesData;
        default:
            return state;
    }
};

const currentCity = (state = {}, action) => {
    switch (action.type) {
        case types.SET_ADMIN_CURRENT_CTIY:
            return action.city;
        default:
            return state;
    }
};

export default combineReducers({
    citiesData,
    currentCity
});