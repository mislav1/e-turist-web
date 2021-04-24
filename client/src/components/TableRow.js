import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { ReactComponent as MoreIcon } from "../assets/more.svg"
import styles from "./TableRow.module.scss"

const TableRow = ({item}) => {

    return (
        <div className={styles["table-row-container"]}>
            {
                item.map((field, index) => {
                    return (
                    <div className={index !== 0 ? styles["row-item-container"] : styles["first-or-last"]} key={index + field}>
                        {field}
                    </div>
                )})
            }
            <div className={styles["first-or-last"]}>
                <MoreIcon height={"20px"}/>
            </div>
        </div>
    )
}

export default TableRow;