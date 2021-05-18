import { combineReducers } from "redux";
import * as types from "../actions/actionTypes";

const commentsData = (state = {comments: [], allCommentsCount: 0}, action) => {
    switch (action.type) {
        case types.SET_ADMIN_COMMENTS:
            return action.commentsData;
        default:
            return state;
    }
};

const currentComment = (state = {}, action) => {
    switch (action.type) {
        case types.SET_ADMIN_CURRENT_COMMENT:
            return action.comment;
        default:
            return state;
    }
};

export default combineReducers({
    commentsData,
    currentComment
});