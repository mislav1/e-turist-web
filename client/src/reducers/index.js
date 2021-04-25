import { combineReducers } from "redux";

import ui from "./ui" 
import admin from "./admin"
import routes from "./routes"
import destinations from "./destinations"
import cities from "./cities"

const fn = () => combineReducers({
    ui,
    admin,
    routes,
    destinations,
    cities
});

export default fn;