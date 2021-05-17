import * as types from "./actionTypes";
import api from "../lib/api";
import { HttpStatus } from "../lib/constants";
import * as actions from "./index";

export function getAllAdminsData(params) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());

        try {
            let url = `/admins?`

            if (params.orderBy) url += `orderBy=${params.orderBy}&`
            if (params.ascOrDesc) url += `ascOrDesc=${params.ascOrDesc}&`
            if (params.limit) url += `limit=${params.limit}&`
            if (params.page) url += `page=${params.page}&`

            console.log("This is url: ", url)

            const response = await api.get(url);

            if (response.status === HttpStatus.Success && response.data.admins) {
                dispatch({
                    type: types.SET_ADMIN_ADMINS,
                    adminsData: response.data
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
            let url = `/admins/delete-by-id`

            console.log("This is url: ", url)

            const response = await api.put(url, { id: params.id });

            if (response.status === HttpStatus.Success) {
                if (params.successCallback) {
                    params.successCallback();
                }
                dispatch(actions.ui.setApiSucces("Administrator uspješno obrisan"));
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
            let url = `/admins/add-new`

            console.log("This is url: ", url)

            const response = await api.postMultipart(url, { 
                username: params.username, 
                password: params.password,
                files: params.picture
            });

            if (response.status === HttpStatus.Success) {
                if (params.successCallback) {
                    params.successCallback();
                }
                dispatch(actions.ui.setApiSucces("Administrator uspješno kreiran"));
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

export function getAdminById(params) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());

        try {
            let url = `/admins/load-by-id?id=${params.id}`

            console.log("This is url: ", url)

            const response = await api.get(url);
            
            if (response.status === HttpStatus.Success && response.data.admin) {
                dispatch({
                    type: types.SET_ADMIN_CURRENT_ADMIN,
                    admin: response.data.admin
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

export function removeCurrentAdmin() {
    return async (dispatch, getState) => {
        dispatch({
            type: types.SET_ADMIN_CURRENT_ADMIN,
            admin: {}
        });
    };
}

export function updateOne(params) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());

        try {
            let url = `/admins/update-by-id`

            console.log("This is url: ", url)

            const response = await api.putMultipart(url, { 
                id: params.id, 
                username: params.username, 
                password: params.password,
                files: params.picture 
            });

            if (response.status === HttpStatus.Success) {
                if (params.successCallback) {
                    params.successCallback();
                }
                dispatch(actions.ui.setApiSucces("Administrator uspješno ažuriran"));
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