import * as types from "./actionTypes";
import api from "../lib/api";
import { HttpStatus } from "../lib/constants";
import * as actions from "./index";

export function getAllUsersData(params) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());

        try {
            let url = `/users?`

            if (params.orderBy) url += `orderBy=${params.orderBy}&`
            if (params.ascOrDesc) url += `ascOrDesc=${params.ascOrDesc}&`
            if (params.limit) url += `limit=${params.limit}&`
            if (params.page) url += `page=${params.page}&`

            console.log("This is url: ", url)

            const response = await api.get(url);

            if (response.status === HttpStatus.Success && response.data.users) {
                dispatch({
                    type: types.SET_ADMIN_USERS,
                    usersData: response.data
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
            let url = `/users/delete-by-id`

            console.log("This is url: ", url)

            const response = await api.put(url, { id: params.id });

            if (response.status === HttpStatus.Success) {
                if (params.successCallback) {
                    params.successCallback();
                }
                dispatch(actions.ui.setApiSucces("Korisnik uspješno obrisan"));
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