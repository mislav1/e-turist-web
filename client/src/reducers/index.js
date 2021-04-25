import { combineReducers } from "redux";

import ui from "./ui" 
import admin from "./admin"
import routes from "./routes"
import destinations from "./destinations"
import cities from "./cities"
import comments from "./comments"

const fn = () => combineReducers({
    ui,
    admin,
    routes,
    destinations,
    cities,
    comments
});

export default fn;