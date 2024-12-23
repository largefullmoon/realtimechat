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

// Thunk action creator for login
export const loginUser = (credentials) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
        const user = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(loginSuccess(user));
    } catch (error) {
        dispatch(loginFailure(error.message));
    }
};

// Thunk action creator for logout
export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('user');
    dispatch(logout());
};
