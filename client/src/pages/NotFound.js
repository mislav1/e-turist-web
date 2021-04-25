import React, { useState, useEffect } from "react"
import styles from "./Login.module.scss"
import { useHistory } from "react-router-dom";

const NotFound = () => {
    let history = useHistory();
    return (
        <>
            <div className={styles.login}>

                <div className={styles["login-container"]}>
                    <div className={styles.title}>404</div>
                    <div className={styles.title}>Ova stranica ne postoji!</div>
                    <div className={styles["link-style"]} onClick={() => history.push("/")}>Početna</div>
                </div>
            </div>
        </>
    )
}

export default NotFound