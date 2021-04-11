import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import * as actions from "../actions"
import { useHistory } from "react-router-dom";
import styles from "./Header.module.scss"
require('dotenv').config()
const { REACT_APP_UPLOADS_URL } = process.env

export default ({ title = "" }) => {
    const dispatch = useDispatch();
    let history = useHistory();

    const globalState = {
        adminDetails: useSelector(state => state.admin.details),
    };

    return (
        <div className={styles["header-container"]}>
            <div className={styles["title"]}>
                {title}
            </div>
            {
                globalState.adminDetails.id &&
                <div className={styles["admin-info"]}>
                    <p>{globalState.adminDetails.username}</p>
                    <img src={REACT_APP_UPLOADS_URL + globalState.adminDetails.picturePath}/>
                </div>
            }

        </div>
    )
}