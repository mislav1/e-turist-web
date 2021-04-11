import _ from "lodash";
import * as types from "./actionTypes";
import api from "../lib/api";
import * as utils from "../lib/utils";
import { HttpStatus, LocalStorageKeyTokenAdmin } from "../lib/constants";
import * as actions from "./index";
import history from "../lib/history";

export function loginAdmin(username, password, callback) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());
        
        try {
            const response = await api.post(
                "/authentication/login",
                { username, password }
            );

            if(response.status === HttpStatus.Success && response.data.token){
                localStorage.setItem(LocalStorageKeyTokenAdmin, response.data.token);
                if(callback){
                    callback();
                }
                dispatch(actions.ui.setApiSucces("Admin uspješno logiran"));
            } else if (response.error){
                dispatch(actions.ui.setApiError(response.error));
            }

            dispatch(actions.ui.stopLoading());
        } catch (e) {
            console.error(e);
            dispatch(actions.ui.stopLoading());
        }
    };
}

export function logoutAdmin(callback) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());
        
        try {
            const response = await api.post(
                "/authentication/logout"
            );
            
            if(response.status === HttpStatus.Success){
                localStorage.removeItem(LocalStorageKeyTokenAdmin)
                if(callback){
                    callback();
                }
                dispatch(actions.ui.setApiSucces("Admin uspješno odjavljen"));
            } else if (response.error){
                dispatch(actions.ui.setApiError(response.error));
            }

            dispatch(actions.ui.stopLoading());
        } catch (e) {
            console.error(e);
            dispatch(actions.ui.stopLoading());
        }
    };
}

export function checktToken(successCallback = null,  errorCallback = null) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());
        
        try {
            const response = await api.post(
                "/authentication/check-token"
            );
            
            if(response.status === HttpStatus.Success && response.data.admin){
                dispatch({
                    type: types.SET_ADMIN_DETAILS,
                    admin: response.data.admin
                });
                if(successCallback){
                    successCallback();
                }
            } else if (response.error){
                if(errorCallback){
                    errorCallback();
                }
            }

            dispatch(actions.ui.stopLoading());
        } catch (e) {
            console.error(e);
            dispatch(actions.ui.stopLoading());
        }
    };
}

export function setAdminData(admin) {
    return async (dispatch, getState) => {
        dispatch({
            types: types.SET_ADMIN_DETAILS,
            admin: admin
        });
    };
}