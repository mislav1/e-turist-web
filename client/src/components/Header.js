import React from "react"
import { useSelector } from "react-redux"
import styles from "./Header.module.scss"
require('dotenv').config()
const { REACT_APP_UPLOADS_URL } = process.env

const ContentHeader = ({ title = "" }) => {

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
                    <img src={REACT_APP_UPLOADS_URL + globalState.adminDetails.picturePath} alt="admin"/>
                </div>
            }

        </div>
    )
}

export default ContentHeader;