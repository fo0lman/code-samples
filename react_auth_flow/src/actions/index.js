import api from '../api';
import { saveSession } from '../utils/session';

export const FETCH_MOVIES_REQUEST = 'FETCH_MOVIES_REQUEST';
export const FETCH_MOVIES_SUCCESS = 'FETCH_MOVIES_SUCCESS';
export const FETCH_MOVIES_FAILURE = 'FETCH_MOVIES_FAILURE';

export const searchMovies = query => dispatch => {
    dispatch({
        type: FETCH_MOVIES_REQUEST,
        query
    });

    return api.searchMovies(query)
        .then(data =>
            dispatch({
                ...data,
                type: FETCH_MOVIES_SUCCESS
            })
        );
};

export const FETCH_MOVIE_REQUEST = 'FETCH_MOVIE_REQUEST';
export const FETCH_MOVIE_SUCCESS = 'FETCH_MOVIE_SUCCESS';
export const FETCH_MOVIE_FAILURE = 'FETCH_MOVIE_FAILURE';

export const fetchMovie = id => dispatch => {
    dispatch({
        type: FETCH_MOVIE_REQUEST,
        id
    });

    return api.fetchMovie(id)
        .then(data =>
            dispatch({
                movie: data,
                type: FETCH_MOVIE_SUCCESS
            })
        );
};

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAILURE = 'AUTH_FAILURE';

export const authSuccess = (token, user) => {
    saveSession(token);

    return {
        user: user,
        token: token,
        type: AUTH_SUCCESS
    };
}

export const restoreAuth = token => dispatch => {
    return api.checkAuth(token)
        .then(
            data => (
                dispatch(authSuccess(token, data))
            )
        );
}

export const auth = (login, password) => dispatch => {
    dispatch({
        type: AUTH_REQUEST,
    });

    return api.auth(login, password)
        .then(
            data => (
                dispatch(authSuccess(data.token, data.user))
            ),
            error => (
                dispatch({
                    error,
                    type: AUTH_FAILURE
                })
            ),
        );
};
