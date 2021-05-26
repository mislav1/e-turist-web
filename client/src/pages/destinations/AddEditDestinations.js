import React, { useState, useEffect, useRef } from "react"
import AdminBase from "../../components/AdminBase"
import { useDispatch, useSelector } from "react-redux"
import * as actions from "../../actions"
import { useHistory } from "react-router-dom";
import { Form, Button, Image } from 'semantic-ui-react'
import styles from "./AddEditDestinations.module.scss"
import { isPictureValid, getPasswordError } from "../../lib/utils"
import { TextFieldNumberOfRows, IconStyle } from "../../lib/constants"
require('dotenv').config()
const { REACT_APP_UPLOADS_URL } = process.env


const AddEditDestinations = (props) => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [routeId, setRouteId] = useState("")
    const [routeOptions, setRouteOptions] = useState([])
    const [picture, setPicture] = useState(null)
    const [pictureSrc, setPictureSrc] = useState(null)
    const [errors, setErrors] = useState({ name: "", description: "", routeId: "", latitude: "", longitude: "" })
    const inputFile = useRef(null)

    const dispatch = useDispatch();
    let history = useHistory();

    let { id } = props.match.params

    const localActions = {
        addNewDestination: (params) => dispatch(actions.destinations.addNew(params)),
        setApiError: (error) => dispatch(actions.ui.setApiError(error)),
        getDestinationById: (params) => dispatch(actions.destinations.getDestinationById(params)),
        removeCurrentDestination: () => dispatch(actions.destinations.removeCurrentDestination()),
        updateOne: (params) => dispatch(actions.destinations.updateOne(params)),
        deleteOne: (params) => dispatch(actions.destinations.deleteOne(params)),
        getAllRoutesData: (params) => dispatch(actions.routes.getAllRoutesData(params)),
    };

    const globalState = {
        currentDestination: useSelector(state => state.destinations.currentDestination),
        routesData: useSelector(state => state.routes.routesData),
    };

    useEffect(() => {
        localActions.getAllRoutesData({
            page: 1,
            orderBy: 'id',
            ascOrDesc: 'asc',
            limit: 8,
        })
        if (id) {
            localActions.getDestinationById({
                id,
                errorCallback: () => {
                    history.push("/not-found")
                }
            })
        }
        return () => {
            localActions.removeCurrentDestination()
        }
    }, [])

    useEffect(() => {
        if (globalState.currentDestination.id) {
            setName(globalState.currentDestination.name)
            setDescription(globalState.currentDestination.description)
            setRouteId(globalState.currentDestination.routeId)
            
            if (globalState.currentDestination.coordinates.coordinates) {
                setLatitude(globalState.currentDestination.coordinates.coordinates[0] || "")
                setLongitude(globalState.currentDestination.coordinates.coordinates[1] || "")
            }
            if (globalState.currentDestination.picturePath) {
                setPictureSrc(REACT_APP_UPLOADS_URL + globalState.currentDestination.picturePath)
            }
            console.log(REACT_APP_UPLOADS_URL + globalState.currentDestination.picturePath)
        }

    }, [globalState.currentDestination.id])

    useEffect(() => {
        if (globalState.routesData.allRoutesCount > 0) {
            const newOptions = globalState.routesData.routes.map((route) => {
                return {
                    key: route.id,
                    value: route.id,
                    text: route.name,
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
                }
            })
            setRouteOptions(newOptions)
        }
    }, [globalState.routesData.allRoutesCount])

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

    const addNewDestination = () => {
        if (!name || !description || !routeId || !latitude || !longitude) {
            setErrors({
                name: name ? "" : "Ime je obavezno polje",
                description: description ? "" : "Opis rute je obavezno polje",
                routeId: routeId ? "" : "Ruta je obavezno polje",
                latitude: latitude ? "" : "Geografska širina je obavezno polje",
                longitude: longitude ? "" : "Geografska dužina je obavezno polje",
            })

            return
        }

        if (!isLatAndLongValid()) {
            return
        }

        localActions.addNewDestination({
            name,
            description,
            picture,
            routeId,
            latitude,
            longitude,
            successCallback: () => { history.push("/admin/destinations") }
        })
    }

    const updateDestination = (id) => {

        if (!name || !description || !routeId || !latitude || !longitude) {
            setErrors({
                name: name ? "" : "Ime je obavezno polje",
                description: description ? "" : "Opis rute je obavezno polje",
                routeId: routeId ? "" : "Ruta je obavezno polje",
                latitude: latitude ? "" : "Geografska širina je obavezno polje",
                longitude: longitude ? "" : "Geografska dužina je obavezno polje",
            })

            return
        }

        if (!isLatAndLongValid()) {
            return
        }

        localActions.updateOne({
            id,
            name,
            description,
            picture,
            routeId,
            latitude,
            longitude,
            successCallback: () => { history.push("/admin/destinations") }
        })
    }

    const deleteDestination = () => {
        localActions.deleteOne({
            id,
            successCallback: () => { history.push("/admin/destinations") }
        })
    }

    const isLatAndLongValid = () => {
        
        if ((latitude < -90 || latitude > 90) && (longitude < -180 || longitude > 190)) {
            setErrors({
                ...errors, 
                latitude: "Geografska širina mora biti između -90 i 90", 
                longitude: "Geografska dužina mora biti između -180 i 180" 
            })
            return false
        } else if ((latitude < -90 || latitude > 90)) {
            setErrors({ ...errors, latitude: "Geografska širina mora biti između -90 i 90" })
            return false
        }
        else if (longitude < -180 || longitude > 190) {
            setErrors({ ...errors, longitude: "Geografska dužina mora biti između -180 i 180" })
            return false
        }

        return true
    }

    return (
        <AdminBase title={id ? "Ažuriraj destinaciju" : "Kreiraj novu destinaciju"} selectedElement={"destinations"}>
            <div className={styles["form-container"]}>
                <div className={styles["form-container-inputs"]}>
                    <Form className={styles["form"]}>
                        <Form.Input
                            fluid
                            label='Ime Destinacije*'
                            placeholder='Ime destinacije'
                            error={errors.name ? errors.name : false}
                            value={name}
                            onChange={e => {
                                if (e.target.value && errors.name) {
                                    setErrors({
                                        ...errors,
                                        name: ""
                                    })
                                }
                                setName(e.target.value)
                            }}
                        />
                        <Form.TextArea
                            fluid
                            label='Opis Destinacije*'
                            placeholder='Opis destinacije'
                            error={errors.description ? errors.description : false}
                            value={description}
                            rows={TextFieldNumberOfRows}
                            onChange={e => {
                                if (e.target.value && errors.description) {
                                    setErrors({
                                        ...errors,
                                        description: ""
                                    })
                                }
                                setDescription(e.target.value)
                            }}
                        />
                        <Form.Input
                            fluid
                            label='Geografska širina*'
                            placeholder='Geografska širina'
                            error={errors.latitude ? errors.latitude : false}
                            value={latitude || ""}
                            type="number"
                            onChange={e => {
                                if (e.target.value && errors.latitude) {
                                    setErrors({
                                        ...errors,
                                        latitude: ""
                                    })
                                }
                                setLatitude(e.target.value)
                            }}
                        />
                        <Form.Input
                            fluid
                            label='Geografska dužina*'
                            placeholder='Geografska dužina'
                            error={errors.longitude ? errors.longitude : false}
                            value={longitude || ""}
                            type="number"
                            onChange={e => {
                                if (e.target.value && errors.longitude) {
                                    setErrors({
                                        ...errors,
                                        longitude: ""
                                    })
                                }
                                setLongitude(e.target.value)
                            }}

                        />
                        <Form.Dropdown
                            label='Odaberite Rutu*'
                            error={errors.routeId ? errors.routeId : false}
                            placeholder='Odaberite rutu'
                            fluid
                            search
                            selection
                            options={routeOptions}
                            noResultsMessage={"Nije pronađen niti jedna ruta"}
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
                            <Button positive onClick={() => addNewDestination()}>Dodaj Destinaciju</Button>
                        </div>
                        :
                        <div className={styles["button-container"]}>
                            <Button color='yellow' onClick={() => updateDestination(id)} >Ažuriraj Destinaciju</Button>
                            <Button negative onClick={() => deleteDestination()}>Obriši Destinaciju</Button>
                        </div>
                }
            </div>

        </AdminBase>
    )
}

export default AddEditDestinations;