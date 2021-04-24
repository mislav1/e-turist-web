import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Message } from 'semantic-ui-react'
import { ReactComponent as Close } from "../assets/cancel-red.svg"
import { useDispatch } from "react-redux"
import * as actions from "../actions"
import styles from "./ErrorMessage.module.scss"

const ErrorMessage = ({ title = "Greška", subtitle = "", fixed = false }) => {

    const dispatch = useDispatch();

    const localActions = {
        removeApiError: (error) => dispatch(actions.ui.removeApiError())
    };

    return (
        <Message negative className={fixed ? styles.errorMessageFixed : styles.errorMessage}>
            <div>
                <Message.Header>{title}</Message.Header>
                <p>{subtitle}</p>
            </div>
            <div onClick={() => localActions.removeApiError()}>
                <Close height={"20px"} width={"20px"} />
            </div>
        </Message>
    )
}

export default ErrorMessage;