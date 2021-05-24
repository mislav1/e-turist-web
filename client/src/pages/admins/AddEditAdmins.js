import React, { useState, useEffect, useRef } from "react"
import AdminBase from "../../components/AdminBase"
import { useDispatch, useSelector } from "react-redux"
import * as actions from "../../actions"
import { useHistory } from "react-router-dom";
import { Form, Button, Image } from 'semantic-ui-react'
import styles from "./AddEditAdmins.module.scss"
import { isPictureValid, getPasswordError } from "../../lib/utils"
require('dotenv').config()
const { REACT_APP_UPLOADS_URL } = process.env


const AddEditAdmins = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [picture, setPicture] = useState(null)
    const [pictureSrc, setPictureSrc] = useState(null)
    const [errors, setErrors] = useState({ username: "", password: "", confirmPassword: "" })
    const inputFile = useRef(null)

    const dispatch = useDispatch();
    let history = useHistory();

    let { id } = props.match.params

    const localActions = {
        addNewAdmin: (params) => dispatch(actions.admins.addNew(params)),
        setApiError: (error) => dispatch(actions.ui.setApiError(error)),
        getAdminById: (params) => dispatch(actions.admins.getAdminById(params)),
        removeCurrentAdmin: () => dispatch(actions.admins.removeCurrentAdmin()),
        updateOne: (params) => dispatch(actions.admins.updateOne(params)),
        deleteOne: (params) => dispatch(actions.admins.deleteOne(params)),
    };

    const globalState = {
        currentAdmin: useSelector(state => state.admins.currentAdmin),
    };

    useEffect(() => {
        if (id) {
            localActions.getAdminById({
                id,
                errorCallback: () => {
                    history.push("/not-found")
                }
            })
        }
        return () => {
            localActions.removeCurrentAdmin()
        }
    }, [])

    useEffect(() => {
        if (globalState.currentAdmin.id) {
            setUsername(globalState.currentAdmin.username)
            if (globalState.currentAdmin.picturePath) {
                setPictureSrc(REACT_APP_UPLOADS_URL + globalState.currentAdmin.picturePath)
            }
            console.log(REACT_APP_UPLOADS_URL + globalState.currentAdmin.picturePath)
        }

    }, [globalState.currentAdmin.id])

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

    const addNewAdmin = () => {
        if (!username || !password || !confirmPassword) {
            setErrors({
                username: username ? "" : "Korisničko ime je obavezno polje",
                password: password ? "" : "Lozinka je obavezno polje",
                confirmPassword: confirmPassword ? "" : "Potrebno je potvrditi lozinku"
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

        localActions.addNewAdmin({
            username,
            password,
            picture,
            successCallback: () => { history.push("/admin/admins") }
        })
    }

    const updateAdmin = (id) => {

        if (!username || !password || !confirmPassword) {
            setErrors({
                username: username ? "" : "Korisničko ime je obavezno polje",
                password: password ? "" : "Lozinka je obavezno polje",
                confirmPassword: confirmPassword ? "" : "Potrebno je potvrditi lozinku"
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
            username,
            password,
            picture,
            successCallback: () => { history.push("/admin/admins") }
        })
    }

    const deleteAdmin = () => {
        localActions.deleteOne({
            id,
            successCallback: () => { history.push("/admin/admins") }
        })
    }

    return (
        <AdminBase title={id ? "Ažuriraj administratora" : "Kreiraj novog administratora"} selectedElement={"admins"}>
            <div className={styles["form-container"]}>
                <div className={styles["form-container-inputs"]}>
                    <Form className={styles["form"]}>
                        <Form.Input
                            fluid
                            label='Korisničko ime*'
                            placeholder='Korisničko ime'
                            error={errors.username ? errors.username : false}
                            value={username}
                            onChange={e => {
                                if (e.target.value && errors.username) {
                                    setErrors({
                                        ...errors,
                                        username: ""
                                    })
                                }
                                setUsername(e.target.value)
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
                            <Button positive onClick={() => addNewAdmin()}>Dodaj Administratora</Button>
                        </div>
                        :
                        <div className={styles["button-container"]}>
                            <Button color='yellow' onClick={() => updateAdmin(id)} >Ažuriraj Adinistratora</Button>
                            <Button negative onClick={() => deleteAdmin()}>Obriši Administratora</Button>
                        </div>
                }
            </div>

        </AdminBase>
    )
}

export default AddEditAdmins;