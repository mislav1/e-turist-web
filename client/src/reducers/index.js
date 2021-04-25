import { combineReducers } from "redux";

import ui from "./ui" 
import admin from "./admin"
import routes from "./routes"
import destinations from "./destinations"

const fn = () => combineReducers({
    ui,
    admin,
    routes,
    destinations
});

export default fn;