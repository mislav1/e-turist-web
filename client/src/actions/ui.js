import * as types from "./actionTypes";

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
        }, 2000);
    };
}

export function setApiSucces(message) {
    return async (dispatch, getState) => {
        dispatch({ type: types.SET_API_SUCCESS, message });

        setTimeout(() => {
            dispatch({ type: types.SET_API_SUCCESS, message: null });
        }, 2000);
    };
}