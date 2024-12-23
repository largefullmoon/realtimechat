import { USER_ACTIONS } from '../reducers/userReducer';
import axios from 'axios';

export const loginStart = () => ({
    type: USER_ACTIONS.LOGIN_START
});

export const loginSuccess = (user) => ({
    type: USER_ACTIONS.LOGIN_SUCCESS,
    payload: user
});

export const loginFailure = (error) => ({
    type: USER_ACTIONS.LOGIN_FAILURE,
    payload: error
});

export const logout = () => ({
    type: USER_ACTIONS.LOGOUT
});

export const setUser = (user) => ({
    type: USER_ACTIONS.SET_USER,
    payload: user
});