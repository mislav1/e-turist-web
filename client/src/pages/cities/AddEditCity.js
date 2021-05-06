import React, { useState, useEffect } from "react"
import AdminBase from "../../components/AdminBase"
import { useDispatch, useSelector } from "react-redux"
import * as actions from "../../actions"
import { useHistory } from "react-router-dom";
import { Form, Button } from 'semantic-ui-react'
import styles from "./AddEditCity.module.scss"


const AddEditCity = (props) => {
    const [name, setName] = useState("")
    const [identifier, setIdentifier] = useState("")
    const [errors, setErrors] = useState({ name: "", identifier: "" })

    const dispatch = useDispatch();
    let history = useHistory();

    let { id } = props.match.params

    const localActions = {
        getCityById: (params) => dispatch(actions.cities.getCityById(params)),
        removeCurrentCity: () => dispatch(actions.cities.removeCurrentCity()),
        updateOne: (params) => dispatch(actions.cities.updateOne(params)),
        addNewCity: (params) => dispatch(actions.cities.addNew(params)),
        deleteOne: (params) => dispatch(actions.cities.deleteOne(params)),
    };

    const globalState = {
        currentCity: useSelector(state => state.cities.currentCity),
    };

    useEffect(() => {
        if (id) {
            localActions.getCityById({
                id,
                errorCallback: () => {
                    history.push("/not-found")
                }
            })
        }
        return () => {
            localActions.removeCurrentCity()
        }
    }, [])

    useEffect(() => {
        if (globalState.currentCity.id) {

            setName(globalState.currentCity.name)
            setIdentifier(globalState.currentCity.identifier)
        }

    }, [globalState.currentCity.id])

    const updateCity = (id) => {

        if(!name || !identifier){
            setErrors({
                identifier: identifier ? "" : "Identifikator je obavezno polje",
                name: name ? "" : "Ime grada je obavezno polje"
            })

            return
        }

        localActions.updateOne({
            id,
            name: name ? name : null,
            identifier: identifier ? identifier : null,
            successCallback: () => { history.push("/admin/cities") }
        })
    }

    const addNewCity = () => {
        if(!name || !identifier){
            setErrors({
                identifier: identifier ? "" : "Identifikator je obavezno polje",
                name: name ? "" : "Ime grada je obavezno polje"
            })

            return
        }

        localActions.addNewCity({
            name,
            identifier,
            successCallback: () => { history.push("/admin/cities") }
        })
    }

    const deleteCity = () => {
        localActions.deleteOne({
            id,
            successCallback: () => { history.push("/admin/cities") }
        })
    }

    return (
        <AdminBase title={id ? "Ažuriraj grad" : "Kreiraj novi grad"} selectedElement={"cities"}>
            <div className={styles["form-container"]}>
                <Form>
                    <Form.Input
                        fluid
                        label='Ime grada*'
                        placeholder='Ime grada'
                        error={errors.name ? errors.name : false}
                        value={name}
                        onChange={e => {
                            if(e.target.value && errors.name){
                                setErrors({
                                    ...errors,
                                    name: ""
                                })
                            }
                            setName(e.target.value)
                        }}
                    />
                    <Form.Input
                        fluid label='Identifikator*'
                        placeholder='Identifikator'
                        error={errors.identifier ? errors.identifier : false}
                        value={identifier}
                        onChange={e => {
                            if(e.target.value && errors.identifier){
                                setErrors({
                                    ...errors,
                                    identifier: ""
                                })
                            }
                            setIdentifier(e.target.value)
                        }}
                    />
                </Form>
                {
                    !id ?
                        <div className={styles["button-container"]}>
                            <Button positive onClick={() => addNewCity()}>Dodaj Grad</Button>
                        </div>
                        :
                        <div className={styles["button-container"]}>
                            <Button color='yellow' onClick={() => updateCity(id)} >Ažuriraj Grad</Button>
                            <Button negative onClick={() => deleteCity()}>Obriši Grad</Button>
                        </div>
                }
            </div>

        </AdminBase>
    )
}

export default AddEditCity;