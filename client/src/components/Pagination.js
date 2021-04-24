import React from "react"
import { useSelector } from "react-redux"
import styles from "./Pagination.module.scss"
import { ReactComponent as LeftArrow } from "../assets/left-arrow.svg"
import { ReactComponent as RightArrow } from "../assets/right-arrow.svg"
import { Button } from 'semantic-ui-react'

const Pagination = ({ updateRowsPerPage, rowsPerPage, updatePage, currentPage, count, buttonAction, buttonName }) => {


    const onChange = () => {
        const numOfRows = document.getElementById("select_id").value;
        updateRowsPerPage(numOfRows)
    }

    const getFrom = () => {
        let from = ((currentPage - 1) * rowsPerPage) + 1
        return from
    }

    const getTo = () => {
        let to = currentPage * rowsPerPage
        if (count < to) return count
        return to
    }

    const handlePageChange = (arrow) => {
        if (arrow === "left") {
            if (currentPage === 1) {
                return
            } else {
                updatePage(currentPage - 1)
            }
        } else {
            if (count <= (currentPage * rowsPerPage)) {
                return
            } else {
                updatePage(currentPage + 1)
            }
        }
    }

    return (
        <div className={styles["pagination"]}>
            <div className={styles["button-container"]}>
                {
                    buttonAction &&
                    <Button positive onClick={() => buttonAction()}>{buttonName}</Button>
                }

            </div>
            <div className={styles["pagination-container"]}>
                <p className={styles["paragraph-label"]}>Broj redova po stranici:</p>
                <select className={styles["rows-select"]} id="select_id" onChange={onChange}>
                    <option selected={rowsPerPage === 8} value={8}>8</option>
                    <option selected={rowsPerPage === 16} value={16}>16</option>
                    <option selected={rowsPerPage === 24} value={24}>24</option>
                    <option selected={rowsPerPage === 32} value={32}>32</option>
                </select>
                <p className={styles["paragraph-label"]}>
                    {`${getFrom()} - ${getTo()} od ${count}`}
                </p>
                <div className={currentPage !== 1 ? styles["img-container"] : styles["img-container-disabled"]} onClick={() => handlePageChange("left")}>
                    <LeftArrow height={"20px"} width={"20px"} />
                </div>
                <div className={count > (currentPage * rowsPerPage) ? styles["img-container"] : styles["img-container-disabled"]}>
                    <RightArrow height={"20px"} width={"20px"} onClick={() => handlePageChange("right")} />
                </div>
            </div>
        </div>
    )
}

export default Pagination;