import * as types from "./actionTypes";
import api from "../lib/api";
import { HttpStatus } from "../lib/constants";
import * as actions from "./index";

export function getAllCommentsData(params) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());

        try {
            let url = `/comments?`

            if (params.orderBy) url += `orderBy=${params.orderBy}&`
            if (params.ascOrDesc) url += `ascOrDesc=${params.ascOrDesc}&`
            if (params.limit) url += `limit=${params.limit}&`
            if (params.page) url += `page=${params.page}&`

            console.log("This is url: ", url)

            const response = await api.get(url);

            if (response.status === HttpStatus.Success && response.data.comments) {
                dispatch({
                    type: types.SET_ADMIN_COMMENTS,
                    commentsData: response.data
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
            let url = `/comments/delete-by-id`

            console.log("This is url: ", url)

            const response = await api.put(url, { id: params.id });

            if (response.status === HttpStatus.Success) {
                if (params.successCallback) {
                    params.successCallback();
                }
                dispatch(actions.ui.setApiSucces("Komentar uspješno obrisan"));
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

export function getCommentById(params) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());

        try {
            let url = `/comments/load-by-id?id=${params.id}`

            console.log("This is url: ", url)

            const response = await api.get(url);

            if (response.status === HttpStatus.Success && response.data.comment) {
                dispatch({
                    type: types.SET_ADMIN_CURRENT_COMMENT,
                    comment: response.data.comment
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

export function removeCurrentComment() {
    return async (dispatch, getState) => {
        dispatch({
            type: types.SET_ADMIN_CURRENT_COMMENT,
            comment: {}
        });
    };
}

export function updateOne(params) {
    return async (dispatch, getState) => {
        dispatch(actions.ui.startLoading());

        try {
            let url = `/comments/update-by-id`

            console.log("This is url: ", url)

            const response = await api.put(url, { id: params.id, userId: params.userId, routeId: params.routeId, comment: params.comment });

            if (response.status === HttpStatus.Success) {
                if (params.successCallback) {
                    params.successCallback();
                }
                dispatch(actions.ui.setApiSucces("Komentar uspješno ažuriran"));
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
            let url = `/comments/add-new`

            console.log("This is url: ", url)

            const response = await api.post(url, { userId: params.userId, routeId: params.routeId, comment: params.comment });

            if (response.status === HttpStatus.Success) {
                if (params.successCallback) {
                    params.successCallback();
                }
                dispatch(actions.ui.setApiSucces("Komentar uspješno kreiran"));
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