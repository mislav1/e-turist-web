import { combineReducers } from "redux";

import ui from "./ui" 
import admin from "./admin"
import routes from "./routes"
import destinations from "./destinations"
import cities from "./cities"
import comments from "./comments"
import admins from "./admins"
import users from "./users"

const fn = () => combineReducers({
    ui,
    admin,
    routes,
    destinations,
    cities,
    comments,
    admins,
    users
});

export default fn;