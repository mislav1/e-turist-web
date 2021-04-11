import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import * as actions from "../actions"
import { useHistory } from "react-router-dom";
import styles from "./AdminBase.module.scss"
import Sidebar from "./AdminSidebar"
import Header from "./Header"

const AdminBase = ({children, title, selectedElement}) => {
    const dispatch = useDispatch();
    let history = useHistory();

    const localActions = {
        checkToken: (successCallback, errorCallback) => dispatch(actions.admin.checktToken(successCallback, errorCallback)),
        setErrorMessage: (error) => dispatch(actions.ui.setApiError(error))
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
            <Sidebar selectedElement={selectedElement}/>
            <div className={styles["content-container"]}>
                <div className={styles["content-title"]}>
                    <Header title={title}/>
                </div>
                <div className={styles["content"]}>{children}</div>
            </div>
            
        </div>
    )
}

export default AdminBase;