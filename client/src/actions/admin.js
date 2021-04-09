import _ from "lodash";
import * as types from "./actionTypes";
import api from "../lib/api";
import * as utils from "../lib/utils";
import { HttpStatus, LocalStorageKeyTokenAdmin } from "../lib/constants";
import * as actions from "./index";
import history from "../lib/history";

export function loginAdmin(username, password, pushTo) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());
        
        try {
            const response = await api.post(
                "/authentication/login",
                { username, password }
            );

            if(response.status === HttpStatus.Success && response.data.token){
                localStorage.setItem(LocalStorageKeyTokenAdmin, response.token);
                if(pushTo){
                    history.push(pushTo)
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

