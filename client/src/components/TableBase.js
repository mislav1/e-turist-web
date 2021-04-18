import React from 'react'
import 'semantic-ui-css/semantic.min.css'

import styles from "./TableBase.module.scss"

const TableBase = ({children}) => {

    return (
        <div className={styles["table-container"]}>
            {children}
        </div>
    )
}

export default TableBase;