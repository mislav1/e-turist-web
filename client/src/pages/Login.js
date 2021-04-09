import React, { useState, useEffect } from "react"
import styles from "./Login.module.scss"

export default (props) => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        console.log(username, password)
    }, [username, password])

    return (
        <div className={styles.login}>

            <div className={styles["login-container"]}>
                <div className={styles.title}>eTurist Administratorsko sučelje</div>
                <label>
                    <p>Korisničko ime:</p>
                    <input type="text" value={username} onChange={e => setUsername((e.target.value).trim())}/>
                </label>
                <label>
                    <p>Lozinka:</p>
                    <input type="password" value={password} onChange={e => setPassword((e.target.value).trim())}/>
                </label>
                <button>OK</button>
            </div>
        </div>
    )
}