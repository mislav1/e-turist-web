import * as types from "./actionTypes";
import api from "../lib/api";
import { HttpStatus } from "../lib/constants";
import * as actions from "./index";

export function getAllCitiesData(params) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());

        try {
            let url = `/cities?`

            if (params.orderBy) url += `orderBy=${params.orderBy}&`
            if (params.ascOrDesc) url += `ascOrDesc=${params.ascOrDesc}&`
            if (params.limit) url += `limit=${params.limit}&`
            if (params.page) url += `page=${params.page}&`

            console.log("This is url: ", url)

            const response = await api.get(url);
            
            if (response.status === HttpStatus.Success && response.data.cities) {
                dispatch({
                    type: types.SET_ADMIN_CITIES,
                    citiesData: response.data
                });
                if (params.successCallback) {
                    params.successCallback();
                }
                
            } else if (response.error) {
                if (params.errorCallback) {
                    params.errorCallback();
                }
                dispatch(actions.ui.setApiError(response.error));
            }

            dispatch(actions.ui.stopLoading());
        } catch (e) {
            console.error(e);
            dispatch(actions.ui.stopLoading());
        }
    };
}

export function deleteOne(params) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());

        try {
            let url = `/cities/delete-by-id`

            console.log("This is url: ", url)

            const response = await api.put(url, { id: params.id });

            if (response.status === HttpStatus.Success) {
                if (params.successCallback) {
                    params.successCallback();
                }
                dispatch(actions.ui.setApiSucces("Grad uspješno obrisan"));
            } else if (response.error) {
                if (params.errorCallback) {
                    params.errorCallback();
                }
                dispatch(actions.ui.setApiError(response.error));
            }

            dispatch(actions.ui.stopLoading());
        } catch (e) {
            console.error(e);
            dispatch(actions.ui.stopLoading());
        }
    };
}

export function getCityById(params) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());

        try {
            let url = `/cities/load-by-id?id=${params.id}`

            console.log("This is url: ", url)

            const response = await api.get(url);
            
            if (response.status === HttpStatus.Success && response.data.city) {
                dispatch({
                    type: types.SET_ADMIN_CURRENT_CTIY,
                    city: response.data.city
                });
                if (params.successCallback) {
                    params.successCallback();
                }
                
            } else if (response.error) {
                if (params.errorCallback) {
                    params.errorCallback();
                }
                dispatch(actions.ui.setApiError(response.error));
            }

            dispatch(actions.ui.stopLoading());
        } catch (e) {
            console.error(e);
            dispatch(actions.ui.stopLoading());
        }
    };
}

export function removeCurrentCity() {
    return async (dispatch, getState) => {
        dispatch({
            type: types.SET_ADMIN_CURRENT_CTIY,
            city: {}
        });
    };
}

export function updateOne(params) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());

        try {
            let url = `/cities/update-by-id`

            console.log("This is url: ", url)

            const response = await api.put(url, { id: params.id, name: params.name, identifier: params.identifier });

            if (response.status === HttpStatus.Success) {
                if (params.successCallback) {
                    params.successCallback();
                }
                dispatch(actions.ui.setApiSucces("Grad uspješno ažuriran"));
            } else if (response.error) {
                if (params.errorCallback) {
                    params.errorCallback();
                }
                dispatch(actions.ui.setApiError(response.error));
            }

            dispatch(actions.ui.stopLoading());
        } catch (e) {
            console.error(e);
            dispatch(actions.ui.stopLoading());
        }
    };
}

export function addNew(params) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());

        try {
            let url = `/cities/add-new`

            console.log("This is url: ", url)

            const response = await api.post(url, { name: params.name, identifier: params.identifier });

            if (response.status === HttpStatus.Success) {
                if (params.successCallback) {
                    params.successCallback();
                }
                dispatch(actions.ui.setApiSucces("Grad uspješno kreiran"));
            } else if (response.error) {
                if (params.errorCallback) {
                    params.errorCallback();
                }
                dispatch(actions.ui.setApiError(response.error));
            }

            dispatch(actions.ui.stopLoading());
        } catch (e) {
            console.error(e);
            dispatch(actions.ui.stopLoading());
        }
    };
}