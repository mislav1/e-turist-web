import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { applyMiddleware, createStore } from "redux"
import { Provider } from "react-redux"
import ReduxThunk from "redux-thunk"
import { composeWithDevTools } from 'redux-devtools-extension';

import createRootReducer from "../reducers"
import Login from "../pages/Login"
import ListRoutes from "../pages/routes/ListRoutes"
import ListDestinations from "../pages/destinations/ListDestinations"
import ListCities from "../pages/cities/ListCities"
import ListComments from "../pages/comments/ListComments"
import ListUsers from "../pages/users/ListUsers"
import ListAdmins from "../pages/admins/ListAdmins"
import NotFound from "../pages/NotFound"
import AddEditCity from "../pages/cities/AddEditCity"
import AddEditAdmins from "../pages/admins/AddEditAdmins"
import AddEditUsers from "../pages/users/AddEditUsers"
import AddEditComment from "../pages/comments/AddEditComment"


const preloadedState = undefined;

const store = createStore(
    createRootReducer(),
    preloadedState,
    composeWithDevTools(applyMiddleware(ReduxThunk))
);

export default function Routes() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/admin/routes" exact component={ListRoutes} />
                    <Route path="/admin/destinations" exact component={ListDestinations} />
                    <Route path="/admin/cities" exact component={ListCities} />
                    <Route path="/admin/comments" exact component={ListComments} />
                    <Route path="/admin/users" exact component={ListUsers} />
                    <Route path="/admin/admins" exact component={ListAdmins} />
                    <Route path="/admin/cities/new" exact component={AddEditCity} />
                    <Route path="/admin/cities/:id/details" exact component={AddEditCity} />
                    <Route path="/admin/admins/new" exact component={AddEditAdmins} />
                    <Route path="/admin/admins/:id/details" exact component={AddEditAdmins} />
                    <Route path="/admin/users/new" exact component={AddEditUsers} />
                    <Route path="/admin/users/:id/details" exact component={AddEditUsers} />
                    <Route path="/admin/comments/new" exact component={AddEditComment} />
                    <Route path="/admin/comments/:id/details" exact component={AddEditComment} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </Provider>
    )

}