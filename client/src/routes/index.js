import React from 'react'
import { BrowserRouter, Route, Switch, Router } from 'react-router-dom'
import { applyMiddleware, compose, createStore } from "redux"
import { Provider } from "react-redux"
import ReduxThunk from "redux-thunk"

import createRootReducer from "../reducers"
import Login from "../pages/Login"
import ListRoutes from "../pages/routes/ListRoutes"


const preloadedState = undefined;

const store = createStore(
    createRootReducer(),
    preloadedState,
    compose(applyMiddleware(ReduxThunk))
);

export default function Routes() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/admin/routes" exact component={ListRoutes} />
                </Switch>
            </BrowserRouter>
        </Provider>
    )

}