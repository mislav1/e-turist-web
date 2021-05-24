import React, { useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { ReactComponent as MoreIcon } from "../assets/more.svg"
import styles from "./TableRow.module.scss"
import MoreActions from "./MoreActions"
import ClickAwayListener from 'react-click-away-listener';
import {getRandomString} from "../lib/utils"

const TableRow = ({ item, id, firstAction, secondAction, firstTitle, secondTitle }) => {

    const [showMoreActions, setShowMoreActions] = useState(false)

    const handleClickAway = () => {
        setShowMoreActions(false)
    };

    return (
        <div className={styles["table-row-container"]}>
            {
                item.map((field, index) => {
                    return (
                        <div className={index !== 0 ? styles["row-item-container"] : styles["first-or-last"]} key={index + getRandomString()}>
                            {field && field.length > 50 ? field.substring(0,50) + "..." : field}
                        </div>
                    )
                })
            }
            <div className={styles["first-or-last"]}>
                <ClickAwayListener onClickAway={handleClickAway}>
                    <div onClick={() => setShowMoreActions(showMoreActions ? false : true)}>
                        <MoreIcon height={"20px"} width={"20px"} />
                    </div>
                </ClickAwayListener>

                {
                    showMoreActions &&
                    <MoreActions 
                        firstAction={firstAction} 
                        firstTitle={firstTitle} 
                        secondAction={secondAction} 
                        secondTitle={secondTitle} 
                        id={id}
                    />
                }
            </div>
        </div>
    )
}

export default TableRow;