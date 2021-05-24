import React, { useState, useEffect, useRef } from "react"
import AdminBase from "../../components/AdminBase"
import { useDispatch, useSelector } from "react-redux"
import * as actions from "../../actions"
import { useHistory } from "react-router-dom";
import { Form, Button, Image } from 'semantic-ui-react'
import styles from "./AddEditUsers.module.scss"
import { isPictureValid, getPasswordError } from "../../lib/utils"
require('dotenv').config()
const { REACT_APP_UPLOADS_URL } = process.env


const AddEditUsers = (props) => {
    const [fullName, setFullName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [email, setEmail] = useState("")
    const [picture, setPicture] = useState(null)
    const [pictureSrc, setPictureSrc] = useState(null)
    const [errors, setErrors] = useState({ fullName: "", password: "", email: "", confirmPassword: "" })
    const inputFile = useRef(null)

    const dispatch = useDispatch();
    let history = useHistory();

    let { id } = props.match.params

    const localActions = {
        addNewUser: (params) => dispatch(actions.users.addNew(params)),
        setApiError: (error) => dispatch(actions.ui.setApiError(error)),
        getUserById: (params) => dispatch(actions.users.getUserById(params)),
        removeCurrentUser: () => dispatch(actions.users.removeCurrentUser()),
        updateOne: (params) => dispatch(actions.users.updateOne(params)),
        deleteOne: (params) => dispatch(actions.users.deleteOne(params)),
    };

    const globalState = {
        currentUser: useSelector(state => state.users.currentUser),
    };

    useEffect(() => {
        if (id) {
            localActions.getUserById({
                id,
                errorCallback: () => {
                    history.push("/not-found")
                }
            })
        }
        return () => {
            localActions.removeCurrentUser()
        }
    }, [])

    useEffect(() => {
        if (globalState.currentUser.id) {
            setFullName(globalState.currentUser.fullName)
            setEmail(globalState.currentUser.email)
            if (globalState.currentUser.picturePath) {
                setPictureSrc(REACT_APP_UPLOADS_URL + globalState.currentUser.picturePath)
            }
            console.log(REACT_APP_UPLOADS_URL + globalState.currentUser.picturePath)
        }

    }, [globalState.currentUser.id])

    const openFileBrowser = () => {
        inputFile.current.click();
    };

    const onChangeFile = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const file = e.target.files[0];
        const pictureError = isPictureValid(file)
        console.log(file)
        if (pictureError) {
            localActions.setApiError(pictureError)
        } else {
            setPictureSrc(URL.createObjectURL(file))
            setPicture(file)
        }

    }

    const addNewUser = () => {
        if (!fullName || !password || !email || !confirmPassword) {
            setErrors({
                fullName: fullName ? "" : "Korisničko ime je obavezno polje",
                password: password ? "" : "Lozinka je obavezno polje",
                confirmPassword: confirmPassword ? "" : "Potrebno je potvrditi lozinku",
                email: email ? "" : "Email je obavezno polje"
            })

            return
        }

        const passwordError = getPasswordError(password)
        if (passwordError) {
            setErrors({
                ...errors,
                password: passwordError
            })
            return
        } else if(password !== confirmPassword){
            setErrors({
                ...errors,
                confirmPassword: "Lozinke se ne poklapaju"
            })
            return
        }

        localActions.addNewUser({
            fullName,
            password,
            picture,
            email,
            successCallback: () => { history.push("/admin/users") }
        })
    }

    const updateUser = (id) => {

        if (!fullName || !password || !email || !confirmPassword) {
            setErrors({
                fullName: fullName ? "" : "Korisničko ime je obavezno polje",
                password: password ? "" : "Lozinka je obavezno polje",
                confirmPassword: confirmPassword ? "" : "Potrebno je potvrditi lozinku",
                email: email ? "" : "Email je obavezno polje"
            })

            return
        }

        const passwordError = getPasswordError(password)
        if (passwordError) {
            setErrors({
                ...errors,
                password: passwordError
            })
            return
        } else if(password !== confirmPassword){
            setErrors({
                ...errors,
                confirmPassword: "Lozinke se ne poklapaju"
            })
            return
        }

        localActions.updateOne({
            id,
            fullName,
            password,
            picture,
            email,
            successCallback: () => { history.push("/admin/users") }
        })
    }

    const deleteUser = () => {
        localActions.deleteOne({
            id,
            successCallback: () => { history.push("/admin/users") }
        })
    }

    return (
        <AdminBase title={id ? "Ažuriraj korisnika" : "Kreiraj novog korisnika"} selectedElement={"users"}>
            <div className={styles["form-container"]}>
                <div className={styles["form-container-inputs"]}>
                    <Form className={styles["form"]}>
                        <Form.Input
                            fluid
                            label='Email*'
                            placeholder='Email'
                            error={errors.email ? errors.email : false}
                            value={email}
                            onChange={e => {
                                if (e.target.value && errors.email) {
                                    setErrors({
                                        ...errors,
                                        email: ""
                                    })
                                }
                                setEmail(e.target.value)
                            }}
                            disabled={id ? true : false}
                        />
                        <Form.Input
                            fluid
                            label='Puno ime*'
                            placeholder='Puno ime'
                            error={errors.fullName ? errors.fullName : false}
                            value={fullName}
                            onChange={e => {
                                if (e.target.value && errors.fullName) {
                                    setErrors({
                                        ...errors,
                                        fullName: ""
                                    })
                                }
                                setFullName(e.target.value)
                            }}
                        />
                        <Form.Input
                            fluid
                            label='Lozinka*'
                            placeholder='Lozinka'
                            error={errors.password ? errors.password : false}
                            value={password}
                            onChange={e => {
                                if (e.target.value && errors.password) {
                                    setErrors({
                                        ...errors,
                                        password: ""
                                    })
                                }
                                setPassword(e.target.value)
                            }}
                            type="password"
                        />

                        <Form.Input
                            fluid
                            label='Potvrdite Lozinku*'
                            placeholder='Potvrdite Lozinku'
                            error={errors.confirmPassword ? errors.confirmPassword : false}
                            value={confirmPassword}
                            onChange={e => {
                                if (e.target.value && errors.confirmPassword) {
                                    setErrors({
                                        ...errors,
                                        confirmPassword: ""
                                    })
                                }
                                setConfirmPassword(e.target.value)
                            }}
                            type="password"
                        />
                    </Form>

                    <Image
                        src={pictureSrc ? pictureSrc : 'https://react.semantic-ui.com/images/wireframe/image.png'}
                        onClick={() => openFileBrowser()}
                        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                        circular
                    />
                </div>
                <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={e => onChangeFile(e)} />
                {
                    !id ?
                        <div className={styles["button-container"]}>
                            <Button positive onClick={() => addNewUser()}>Dodaj Korisnika</Button>
                        </div>
                        :
                        <div className={styles["button-container"]}>
                            <Button color='yellow' onClick={() => updateUser(id)} >Ažuriraj Korisnika</Button>
                            <Button negative onClick={() => deleteUser()}>Obriši Korisnika</Button>
                        </div>
                }
            </div>

        </AdminBase>
    )
}

export default AddEditUsers;