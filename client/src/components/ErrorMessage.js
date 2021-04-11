import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Message } from 'semantic-ui-react'

import styles from "./ErrorMessage.module.scss"

const ErrorMessage = ({ title = "Greška", subtitle = "", fixed = false }) => {

    return (
        <Message negative className={fixed ? styles.errorMessageFixed : styles.ErrorMessage}>
            <Message.Header>{title}</Message.Header>
            <p>{subtitle}</p>
        </Message>
    )
}

export default ErrorMessage;