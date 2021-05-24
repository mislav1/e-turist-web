import React from "react"
import { useSelector, useDispatch } from "react-redux"
import styles from "./Header.module.scss"
import * as actions from "../actions"
import { ReactComponent as MenuIcon } from "../assets/menu.svg"
require('dotenv').config()
const { REACT_APP_UPLOADS_URL } = process.env

const ContentHeader = ({ title = "" }) => {
    const dispatch = useDispatch();
    const globalState = {
        adminDetails: useSelector(state => state.admin.details),
    };

    const localActions = {
        setShowSideBar: (show) => dispatch(actions.ui.setShowSideBar(show))
    };

    return (
        <div className={styles["header-container"]}>
            <div 
                className={styles["header-menu-icon-container"]}
                onClick={() => {
                    localActions.setShowSideBar(true)
                }}
            ><MenuIcon /></div>
            <div className={styles["title"]}>
                {title}
            </div>
            {
                globalState.adminDetails.id &&
                <div className={styles["admin-info"]}>
                    <p className={styles["admin-username"]}>{globalState.adminDetails.username}</p>
                    <img src={REACT_APP_UPLOADS_URL + globalState.adminDetails.picturePath} alt="admin"/>
                </div>
            }

        </div>
    )
}

export default ContentHeader;