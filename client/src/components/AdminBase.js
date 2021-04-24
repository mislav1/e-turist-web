import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as actions from "../actions"
import { useHistory } from "react-router-dom";
import styles from "./AdminBase.module.scss"
import Sidebar from "./AdminSidebar"
import Header from "./Header"
import ErrorMessage from "./ErrorMessage"
import SuccessMessage from "./SuccessMessage"

const AdminBase = ({ children, title, selectedElement }) => {
    const dispatch = useDispatch();
    let history = useHistory();

    const localActions = {
        checkToken: (successCallback, errorCallback) => dispatch(actions.admin.checktToken(successCallback, errorCallback)),
        setErrorMessage: (error) => dispatch(actions.ui.setApiError(error))
    };

    const globalState = {
        isLoading: useSelector(state => state.ui.isLoading),
        apiError: useSelector(state => state.ui.apiError),
        apiSuccess: useSelector(state => state.ui.apiSuccess),
    };

    useEffect(() => {
        localActions.checkToken(null, errorCallback)
    }, [])

    const errorCallback = () => {
        localActions.setErrorMessage("Sesija je istekla, prijavite se ponovno!")
        history.push("/")
    }

    return (
        <div className={styles["base-container"]}>
            <Sidebar selectedElement={selectedElement} />
            <div className={styles["content-container"]}>
                <div className={styles["content-title"]}>
                    <Header title={title} />
                </div>
                <div className={styles["content"]}>{children}</div>
            </div>
            { (globalState.apiError || globalState.apiSuccess) &&
                <div id={styles["api-message-id"]}>
                    {
                        globalState.apiError &&
                        <ErrorMessage subtitle={globalState.apiError} />
                    }
                    {
                        globalState.apiSuccess &&
                        <SuccessMessage subtitle={globalState.apiSuccess} />
                    }
                </div>
            }


        </div>
    )
}

export default AdminBase;