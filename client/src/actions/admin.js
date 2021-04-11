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

