import * as types from "./actionTypes";
import { NotificationDuration } from "../lib/constants"

export function startLoading() {
    return async (dispatch, getState) => {
        dispatch({ type: types.SET_LOADING, loading: true });
    };
}

export function stopLoading() {
    return async (dispatch, getState) => {
        dispatch({ type: types.SET_LOADING, loading: false });
    };
}

export function setApiError(error) {
    return async (dispatch, getState) => {
        dispatch({ type: types.SET_API_ERROR, error });

        setTimeout(() => {
            dispatch({ type: types.SET_API_ERROR, error: null });
        }, NotificationDuration);
    };
}

export function setApiSucces(message) {
    return async (dispatch, getState) => {
        dispatch({ type: types.SET_API_SUCCESS, message });

        setTimeout(() => {
            dispatch({ type: types.SET_API_SUCCESS, message: null });
        }, NotificationDuration);
    };
}

export function removeApiError() {
    return async (dispatch, getState) => {
        dispatch({ type: types.SET_API_ERROR, error: null });
    };
}

export function removeApiSucces(message) {
    return async (dispatch, getState) => {
        dispatch({ type: types.SET_API_SUCCESS, message: null });
    };
}