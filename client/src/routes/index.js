import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { applyMiddleware, compose, createStore } from "redux"
import { Provider } from "react-redux"
import ReduxThunk from "redux-thunk"

import createRootReducer from "../reducers"
import Login from "../pages/Login"


const preloadedState = undefined;

const store = createStore(
    createRootReducer(),
    preloadedState,
    compose(applyMiddleware(ReduxThunk))
);

export default function Routes() {
    return (
        <Provider store={store}>
            <BrowserRouter forceRefresh={true}>
                <Switch>
                    <Route path="/" exact component={Login} />
                </Switch>
            </BrowserRouter>
        </Provider>
    )

}