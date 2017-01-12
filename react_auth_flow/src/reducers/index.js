import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import {
    FETCH_MOVIES_REQUEST,
    FETCH_MOVIES_SUCCESS,
    FETCH_MOVIE_REQUEST,
    FETCH_MOVIE_SUCCESS,
    AUTH_REQUEST,
    AUTH_SUCCESS,
    AUTH_FAILURE
} from '../actions';

const movies = (state = { isFetching: false, items: [] }, action) => {
    switch (action.type) {
        case FETCH_MOVIES_REQUEST:
            return {
                ...state,
                isFetching: true
            };
        case FETCH_MOVIES_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.results
            };
        default:
            return state
    }
};

const movie = (state = { isFetching: false, info: {} }, action) => {
    switch (action.type) {
        case FETCH_MOVIE_REQUEST:
            return {
                ...state,
                isFetching: true
            };
        case FETCH_MOVIE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                info: action.movie
            };
        default:
            return state
    }
};

const session = (state = { isLoggingIn: false, isLoggedIn: false, error: null }, action) => {
    switch (action.type) {
        case AUTH_REQUEST:
            return {
                ...state,
                isLoggingIn: true,
            };
        case AUTH_SUCCESS:
            return {
                ...state,
                isLoggingIn: false,
                isLoggedIn: true,
            };
        case AUTH_FAILURE:
            return {
                ...state,
                isLoggingIn: false,
                isLoggedIn: false,
                error: action.error,
            };
        default:
            return state
    }
}

export default combineReducers({
    movies,
    movie,
    session,
    routing: routerReducer
});
