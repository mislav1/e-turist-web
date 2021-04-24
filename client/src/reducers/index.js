import { combineReducers } from "redux";

import ui from "./ui" 
import admin from "./admin"
import routes from "./routes"

const fn = () => combineReducers({
    ui,
    admin,
    routes
});

export default fn;