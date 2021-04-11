import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import * as actions from "../../actions"
import ErrorMessage from "../../components/ErrorMessage"
import SuccessMessage from "../../components/SuccessMessage"
import { useHistory } from "react-router-dom";
import AdminBase from "../../components/AdminBase"

export default (props) => {
    const dispatch = useDispatch();
    let history = useHistory();

    const localActions = {
        loginAdmin: (username, password, cb) => dispatch(actions.admin.loginAdmin(username, password, cb))
    };

    const globalState = {
        isLoading: useSelector(state => state.ui.isLoading),
        apiError: useSelector(state => state.ui.apiError),
        apiSuccess: useSelector(state => state.ui.apiSuccess),
    };

    return (
        <AdminBase title={"Gradovi"} selectedElement={"cities"}>
            <div>LISTA GRADOVA</div>
        </AdminBase>
    )
}