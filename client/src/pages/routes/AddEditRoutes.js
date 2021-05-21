import React, { useState, useEffect, useRef } from "react"
import AdminBase from "../../components/AdminBase"
import { useDispatch, useSelector } from "react-redux"
import * as actions from "../../actions"
import { useHistory } from "react-router-dom";
import { Form, Button, Image } from 'semantic-ui-react'
import styles from "./AddEditRoutes.module.scss"
import { isPictureValid, getPasswordError } from "../../lib/utils"
import { TextFieldNumberOfRows } from "../../lib/constants"
require('dotenv').config()
const { REACT_APP_UPLOADS_URL } = process.env


const AddEditRoutes = (props) => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [cityId, setCityId] = useState("")
    const [cityOptions, setCityOptions] = useState([])
    const [picture, setPicture] = useState(null)
    const [pictureSrc, setPictureSrc] = useState(null)
    const [errors, setErrors] = useState({ name: "", description: "", cityId: "" })
    const inputFile = useRef(null)

    const dispatch = useDispatch();
    let history = useHistory();

    let { id } = props.match.params

    const localActions = {
        addNewRoute: (params) => dispatch(actions.routes.addNew(params)),
        setApiError: (error) => dispatch(actions.ui.setApiError(error)),
        getRouteById: (params) => dispatch(actions.routes.getRouteById(params)),
        removeCurrentRoute: () => dispatch(actions.routes.removeCurrentRoute()),
        updateOne: (params) => dispatch(actions.routes.updateOne(params)),
        deleteOne: (params) => dispatch(actions.routes.deleteOne(params)),
        getAllCitiesData: (params) => dispatch(actions.cities.getAllCitiesData(params)),
    };

    const globalState = {
        currentRoute: useSelector(state => state.routes.currentRoute),
        citiesData: useSelector(state => state.cities.citiesData),
    };

    useEffect(() => {
        localActions.getAllCitiesData({
            page: 1,
            orderBy: 'id',
            ascOrDesc: 'asc',
            limit: 8,
        })
        if (id) {
            localActions.getRouteById({
                id,
                errorCallback: () => {
                    history.push("/not-found")
                }
            })
        }
        return () => {
            localActions.removeCurrentRoute()
        }
    }, [])

    useEffect(() => {
        if (globalState.currentRoute.id) {
            setName(globalState.currentRoute.name)
            setDescription(globalState.currentRoute.description)
            setCityId(globalState.currentRoute.cityId)
            if (globalState.currentRoute.picturePath) {
                setPictureSrc(REACT_APP_UPLOADS_URL + globalState.currentRoute.picturePath)
            }
            console.log(REACT_APP_UPLOADS_URL + globalState.currentRoute.picturePath)
        }

    }, [globalState.currentRoute.id])

    useEffect(() => {
        if (globalState.citiesData.allCitiesCount > 0) {
            const newOptions = globalState.citiesData.cities.map((city) => {
                return {
                    key: city.id,
                    value: city.id,
                    text: city.name
                }
            })
            setCityOptions(newOptions)
        }
    }, [globalState.citiesData.allCitiesCount])

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

    const addNewRoute = () => {
        if (!name || !description || !cityId) {
            setErrors({
                name: name ? "" : "Ime je obavezno polje",
                description: description ? "" : "Opis rute je obavezno polje",
                cityId: cityId ? "" : "Grad je obavezno polje",
            })

            return
        }

        localActions.addNewRoute({
            name,
            description,
            picture,
            cityId,
            successCallback: () => { history.push("/admin/routes") }
        })
    }

    const updateRoute = (id) => {

        if (!name || !description || !cityId) {
            setErrors({
                name: name ? "" : "Ime je obavezno polje",
                description: description ? "" : "Opis rute je obavezno polje",
                cityId: cityId ? "" : "Grad je obavezno polje",
            })

            return
        }

        localActions.updateOne({
            id,
            name,
            description,
            picture,
            cityId,
            successCallback: () => { history.push("/admin/routes") }
        })
    }

    const deleteUser = () => {
        localActions.deleteOne({
            id,
            successCallback: () => { history.push("/admin/routes") }
        })
    }

    return (
        <AdminBase title={id ? "Ažuriraj rutu" : "Kreiraj novu rutu"} selectedElement={"routes"}>
            <div className={styles["form-container"]}>
                <div className={styles["form-container-inputs"]}>
                    <Form className={styles["form"]}>
                        <Form.Input
                            fluid
                            label='Ime rute*'
                            placeholder='Ime rute'
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
                            label='Opis Rute*'
                            placeholder='Opis rute'
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

                        <Form.Dropdown
                            label='Odaberite grad*'
                            error={errors.cityId ? errors.cityId : false}
                            placeholder='Odaberite grad'
                            fluid
                            search
                            selection
                            options={cityOptions}
                            noResultsMessage={"Nije pronađen niti jedan grad"}
                            onChange={(e, { value }) => {
                                setCityId(value ? value : "")
                                if (value && errors.cityId) {
                                    setErrors({
                                        ...errors,
                                        cityId: ""
                                    })
                                }
                            }}
                            value={cityId}
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
                            <Button positive onClick={() => addNewRoute()}>Dodaj Rutu</Button>
                        </div>
                        :
                        <div className={styles["button-container"]}>
                            <Button color='yellow' onClick={() => updateRoute(id)} >Ažuriraj Rutu</Button>
                            <Button negative onClick={() => deleteUser()}>Obriši Rutu</Button>
                        </div>
                }
            </div>

        </AdminBase>
    )
}

export default AddEditRoutes;