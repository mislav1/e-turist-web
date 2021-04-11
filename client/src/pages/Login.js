import React, { useState, useEffect } from "react"
import styles from "./Login.module.scss"
import { useSelector, useDispatch } from "react-redux"
import * as actions from "../actions"
import ErrorMessage from "../components/ErrorMessage"
import SuccessMessage from "../components/SuccessMessage"
import { useHistory } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    let history = useHistory();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const localActions = {
        loginAdmin: (username, password, cb) => dispatch(actions.admin.loginAdmin(username, password, cb)),
        checkToken: (successCallback, errorCallback) => dispatch(actions.admin.checktToken(successCallback, errorCallback))
    };

    const globalState = {
        isLoading: useSelector(state => state.ui.isLoading),
        apiError: useSelector(state => state.ui.apiError),
        apiSuccess: useSelector(state => state.ui.apiSuccess),
    };

    useEffect(() => {
        localActions.checkToken(successCallback)
    }, [])

    const successCallback = () => {
        history.push("/admin/routes")
    }

    const handleLogin = () => {
        localActions.loginAdmin(username, password, loginCallback)
    }

    const loginCallback = () => {
        history.push("/admin/routes")
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

export default Login