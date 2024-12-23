import { WINDOW_ACTIONS } from '../reducers/windowReducer';

export const addWindow = ({ senderId, receiverId, receivedUser }) => ({
    type: WINDOW_ACTIONS.ADD_WINDOW,
    payload: { senderId, receiverId, receivedUser }
});

export const removeWindow = ({ senderId, receiverId }) => ({
    type: WINDOW_ACTIONS.REMOVE_WINDOW,
    payload: { senderId, receiverId }
});

export const toggleWindow = ({ senderId, receiverId }) => ({
    type: WINDOW_ACTIONS.TOGGLE_WINDOW,
    payload: { senderId, receiverId }
});
