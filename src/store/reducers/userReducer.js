// Initial state
const initialState = {
    currentUser: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

// Action Types
export const USER_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    SET_USER: 'SET_USER'
};

// User Reducer
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_ACTIONS.LOGIN_START:
            return {
                ...state,
                loading: true,
                error: null
            };
        case USER_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                currentUser: action.payload,
                error: null
            };
        case USER_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                currentUser: null,
                error: action.payload
            };
        case USER_ACTIONS.LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                currentUser: null,
                error: null
            };
        case USER_ACTIONS.SET_USER:
            return {
                ...state,
                currentUser: action.payload,
                isAuthenticated: !!action.payload
            };
        default:
            return state;
    }
};

export default userReducer;
