import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import styles from "./MoreActions.module.scss"

const MoreActions = ({firstTitle, firstAction, secondTitle, secondAction, id}) => {

    return (
        <div className={styles["more-actions-container"]}>
            <div className={styles["text-container"]} onClick={() => firstAction(id)} onPointerDown={() => firstAction(id)}>
                {firstTitle}
            </div>
            
            <div className={styles["text-container"]} onClick={() => secondAction(id)}  onPointerDown={() => secondAction(id)}>
                {secondTitle}
            </div>
        </div>
    )
}

export default MoreActions;