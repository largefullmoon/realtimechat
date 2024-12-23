import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './reducers/messageReducer';
import windowReducer from './reducers/windowReducer';
import userReducer from './reducers/userReducer';

const store = configureStore({
    reducer: {
        messages: messageReducer,
        windows: windowReducer,
        user: userReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Load user from localStorage on store initialization
const savedUser = localStorage.getItem('user');
if (savedUser) {
    store.dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
}

export default store;
