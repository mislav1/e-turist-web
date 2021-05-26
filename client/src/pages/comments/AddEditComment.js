import React, { useState, useEffect } from "react"
import AdminBase from "../../components/AdminBase"
import { useDispatch, useSelector } from "react-redux"
import * as actions from "../../actions"
import { useHistory } from "react-router-dom";
import { Form, Button, TextArea } from 'semantic-ui-react'
import styles from "./AddEditComment.module.scss"
import { IconStyle } from "../../lib/constants"
import { TextFieldNumberOfRows } from "../../lib/constants"
require('dotenv').config()
const { REACT_APP_UPLOADS_URL } = process.env



const AddEditComment = (props) => {
    const [comment, setComment] = useState("")
    const [userId, setUserId] = useState("")
    const [routeId, setRouteId] = useState("")
    const [destinationId, setDestinationId] = useState("")
    const [userOptions, setUserOptions] = useState([])
    const [routeOptions, setRouteOptions] = useState([])
    const [destinationOptions, setDestinationOptions] = useState([])
    const [errors, setErrors] = useState({ comment: "", userId: "", routeId: "", destinationId: "" })

    const dispatch = useDispatch();
    let history = useHistory();

    let { id } = props.match.params

    const localActions = {
        getCommentById: (params) => dispatch(actions.comments.getCommentById(params)),
        removeCurrentComment: () => dispatch(actions.comments.removeCurrentComment()),
        updateOne: (params) => dispatch(actions.comments.updateOne(params)),
        addNewComment: (params) => dispatch(actions.comments.addNew(params)),
        deleteOne: (params) => dispatch(actions.comments.deleteOne(params)),
        getAllUsersData: (params) => dispatch(actions.users.getAllUsersData(params)),
        getAllRoutesData: (params) => dispatch(actions.routes.getAllRoutesData(params)),
        getAllDestinationsData: (params) => dispatch(actions.destinations.getAllDestinationsData(params)),
        getDestinationByRouteId: (params) => dispatch(actions.destinations.getDestinationBRouteId(params)),
        removeAdminDestinations: () => dispatch(actions.destinations.removeAdminDestinations()),
    };

    const globalState = {
        currentComment: useSelector(state => state.comments.currentComment),
        usersData: useSelector(state => state.users.usersData),
        routesData: useSelector(state => state.routes.routesData),
        destinationsData: useSelector(state => state.destinations.destinationsData),
    };

    useEffect(() => {
        if (globalState.usersData.allUsersCount > 0) {
            const newOptions = globalState.usersData.users.map((user) => {
                return {
                    key: user.id,
                    value: user.id,
                    image: (
                        <img
                            src={
                                user.picturePath
                                    ?
                                    REACT_APP_UPLOADS_URL + user.picturePath
                                    :
                                    'https://react.semantic-ui.com/images/wireframe/image.png'
                            }
                            style={IconStyle}
                        />
                    ),
                    text: user.fullName
                }
            })
            setUserOptions(newOptions)
        }
    }, [globalState.usersData.allUsersCount])

    useEffect(() => {
        if (globalState.routesData.allRoutesCount > 0) {
            const newOptions = globalState.routesData.routes.map((route) => {
                return {
                    key: route.id,
                    value: route.id,
                    image: (
                        <img
                            src={
                                route.picturePath
                                    ?
                                    REACT_APP_UPLOADS_URL + route.picturePath
                                    :
                                    'https://react.semantic-ui.com/images/wireframe/image.png'
                            }
                            style={IconStyle}
                        />
                    ),
                    text: route.name
                }
            })
            setRouteOptions(newOptions)
        }
    }, [globalState.routesData.allRoutesCount])

    useEffect(() => {
        const newOptions = globalState.destinationsData.destinations.map((destination) => {
            return {
                key: destination.id,
                value: destination.id,
                image: (
                    <img
                        src={
                            destination.picturePath
                                ?
                                REACT_APP_UPLOADS_URL + destination.picturePath
                                :
                                'https://react.semantic-ui.com/images/wireframe/image.png'
                        }
                        style={IconStyle}
                    />
                ),
                text: destination.name
            }
        })
        newOptions.unshift({
            key: -1,
            value: null,
            text: ""
        })
        setDestinationOptions(newOptions)
    }, [globalState.destinationsData.destinations])

    useEffect(() => {
        routeId ?
            localActions.getDestinationByRouteId({ routeId })
            :
            setDestinationOptions([])
    }, [routeId])

    useEffect(() => {
        localActions.getAllUsersData({
            page: 1,
            orderBy: 'id',
            ascOrDesc: 'asc',
            limit: 8,
        })
        localActions.getAllRoutesData({
            page: 1,
            orderBy: 'id',
            ascOrDesc: 'asc',
            limit: 8,
        })
        if (id) {
            localActions.getCommentById({
                id,
                errorCallback: () => {
                    history.push("/not-found")
                }
            })
        }
        return () => {
            localActions.removeCurrentComment()
            localActions.removeAdminDestinations()
        }
    }, [])

    useEffect(() => {
        if (globalState.currentComment.id) {
            setUserId(globalState.currentComment.userId)
            setComment(globalState.currentComment.comment)
            setRouteId(globalState.currentComment.routeId)
            setDestinationId(globalState.currentComment.destinationId || null)
        }

    }, [globalState.currentComment.id])

    const updateComment = (id) => {

        if (!comment || !routeId || !userId) {
            setErrors({
                comment: comment ? "" : "Komentar je obavezno polje",
                routeId: routeId ? "" : "Potrebno je odabradti rutu",
                userId: userId ? "" : "Potrebno je odabrati korisnika"
            })

            return
        }

        localActions.updateOne({
            id,
            comment: comment ? comment : null,
            routeId: routeId ? routeId : null,
            userId: userId ? userId : null,
            destinationId: destinationId ? destinationId : null,
            successCallback: () => { history.push("/admin/comments") }
        })
    }

    const addNewComment = () => {
        if (!comment || !routeId || !userId) {
            setErrors({
                comment: comment ? "" : "Komentar je obavezno polje",
                routeId: routeId ? "" : "Potrebno je odabradti rutu",
                userId: userId ? "" : "Potrebno je odabrati korisnika"
            })

            return
        }

        localActions.addNewComment({
            comment: comment ? comment : null,
            routeId: routeId ? routeId : null,
            userId: userId ? userId : null,
            destinationId: destinationId ? destinationId : null,
            successCallback: () => { history.push("/admin/comments") }
        })
    }

    const deleteComment = () => {
        localActions.deleteOne({
            id,
            successCallback: () => { history.push("/admin/comments") }
        })
    }

    return (
        <AdminBase title={id ? "Ažuriraj komentar" : "Kreiraj novi komentar"} selectedElement={"comments"}>
            <div className={styles["form-container"]}>
                <Form>
                    <Form.TextArea
                        fluid
                        label='Komentar*'
                        placeholder='Komentar'
                        error={errors.comment ? errors.comment : false}
                        value={comment}
                        rows={TextFieldNumberOfRows}
                        onChange={e => {
                            if (e.target.value && errors.comment) {
                                setErrors({
                                    ...errors,
                                    comment: ""
                                })
                            }
                            setComment(e.target.value)
                        }}
                    />
                    <Form.Dropdown
                        label='Odaberite korisnika*'
                        error={errors.userId ? errors.userId : false}
                        placeholder='Odaberite korisnika'
                        fluid
                        search
                        selection
                        options={userOptions}
                        noResultsMessage={"Nije pronađen niti jedan korisnik"}
                        onChange={(e, { value }) => {
                            setUserId(value ? value : "")
                            if (value && errors.userId) {
                                setErrors({
                                    ...errors,
                                    userId: ""
                                })
                            }
                        }}
                        value={userId}
                    />

                    <Form.Dropdown
                        label='Odaberite rutu*'
                        error={errors.routeId ? errors.routeId : false}
                        placeholder='Odaberite rutu'
                        fluid
                        search
                        selection
                        options={routeOptions}
                        noResultsMessage={"Nije pronađena niti jedna ruta"}
                        onChange={(e, { value }) => {
                            setRouteId(value ? value : "")
                            if (value && errors.routeId) {
                                setErrors({
                                    ...errors,
                                    routeId: ""
                                })
                            }
                        }}
                        value={routeId}
                    />
                    <Form.Dropdown
                        label='Odaberite destinaciju*'
                        error={errors.routeId ? errors.routeId : false}
                        placeholder='Odaberite destinaciju'
                        search
                        selection
                        options={destinationOptions}
                        noResultsMessage={"Nije pronađena niti jedna destinacija"}
                        onChange={(e, { value }) => {
                            setDestinationId(value ? value : "")
                            if (value && errors.destinationId) {
                                setErrors({
                                    ...errors,
                                    destinationId: ""
                                })
                            }
                        }}
                        value={destinationId}
                    />
                </Form>
                {
                    !id ?
                        <div className={styles["button-container"]}>
                            <Button positive onClick={() => addNewComment()}>Dodaj Komentar</Button>
                        </div>
                        :
                        <div className={styles["button-container"]}>
                            <Button color='yellow' onClick={() => updateComment(id)} >Ažuriraj Komentar</Button>
                            <Button negative onClick={() => deleteComment()}>Obriši Komentar</Button>
                        </div>
                }
            </div>

        </AdminBase>
    )
}

export default AddEditComment;