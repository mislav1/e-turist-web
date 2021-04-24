import React from 'react'
import 'semantic-ui-css/semantic.min.css'

import styles from "./TableHeader.module.scss"

const TableHeader = ({ headerColumns, dbColumns, updateFilters }) => {

    return (
        <div className={styles["table-header-container"]}>
            {
                headerColumns.map((column, index) => {
                    return (
                    <div 
                        className={index !== 0 ? styles["header-item-container"] : styles["first-or-last"]} 
                        key={column}
                        onClick={() => updateFilters(dbColumns[index])}
                    >
                        {column}
                    </div>
                )})
            }
            <div className={styles["first-or-last"]}>
            </div>
        </div>
    )
}

export default TableHeader;