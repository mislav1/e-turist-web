import { combineReducers } from "redux";

import ui from "./ui" 
import admin from "./admin"

const fn = () => combineReducers({
    ui,
    admin
});

export default fn;