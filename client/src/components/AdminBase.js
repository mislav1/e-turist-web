import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import * as actions from "../actions"
import { useHistory } from "react-router-dom";
import styles from "./AdminBase.module.scss"
import Sidebar from "./AdminSidebar"

export default ({children, title, selectedElement}) => {
    const dispatch = useDispatch();
    let history = useHistory();
    
    return (
        <div className={styles["base-container"]}>
            <Sidebar selectedElement={selectedElement}/>
            <div className={styles["content-container"]}>
                <div className={styles["content-title"]}>{title}</div>
                <div className={styles["content"]}>{children}</div>
            </div>
            
        </div>
    )
}