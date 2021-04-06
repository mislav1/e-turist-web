import React from "react"
import styles from "./Login.module.scss"

export default (props) => {

    return (
        <div className={styles.login}>

            <div className={styles["login-container"]}>
                <div className={styles.title}>E-turist Administratorsko sučelje</div>
                <label>
                    <p>Email:</p>
                    <input type="text" />
                </label>
                <label>
                    <p>Lozinka:</p>
                    <input type="password" />
                </label>
            </div>
        </div>
    )
}