import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Message } from 'semantic-ui-react'

import styles from "./ErrorMessage.module.scss"

const ErrorMessage = ({ title = "Uspjeh", subtitle = "", fixed = false }) => {

    return (
        <Message positive className={fixed ? styles.errorMessageFixed : styles.ErrorMessage}>
            <Message.Header>{title}</Message.Header>
            <p>{subtitle}</p>
        </Message>
    )
}

export default ErrorMessage;