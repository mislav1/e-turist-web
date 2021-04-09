import React, { useState, useEffect } from "react"
import styles from "./Login.module.scss"
import { useSelector, useDispatch } from "react-redux"
import * as actions from "../actions"
import ErrorMessage from "../components/ErrorMessage"
import SuccessMessage from "../components/SuccessMessage"

export default (props) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const localActions = {
        loginAdmin: (username, password, pushTo) => dispatch(actions.admin.loginAdmin(username, password, pushTo))
    };

    const globalState = {
        isLoading: useSelector(state => state.ui.isLoading),
        apiError: useSelector(state => state.ui.apiError),
        apiSuccess: useSelector(state => state.ui.apiSuccess),
    };

    const handleLogin = () => {
        localActions.loginAdmin(username, password, "/admin/routes")
    }

    return (
        <>
            <div className={styles.login}>

                <div className={styles["login-container"]}>
                    <div className={styles.title}>eTurist Administratorsko sučelje</div>
                    <label>
                        <p>Korisničko ime:</p>
                        <input type="text" value={username} onChange={e => setUsername((e.target.value).trim())} />
                    </label>
                    <label>
                        <p>Lozinka:</p>
                        <input type="password" value={password} onChange={e => setPassword((e.target.value).trim())} />
                    </label>
                    <button onClick={handleLogin}>OK</button>
                </div>
            </div>
            {
                globalState.apiError &&
                <ErrorMessage subtitle={globalState.apiError} fixed />
            }
            {
                globalState.apiSuccess &&
                <SuccessMessage subtitle={globalState.apiSuccess} fixed />
            }
        </>
    )
}