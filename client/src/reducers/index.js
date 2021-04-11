import { combineReducers } from "redux";

import ui from "./ui" 
import admin from "./admin"


export default () => combineReducers({
    ui,
    admin
});