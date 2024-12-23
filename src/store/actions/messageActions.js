import { MESSAGE_ACTIONS } from '../reducers/messageReducer';

export const fetchMessagesStart = () => ({
    type: MESSAGE_ACTIONS.FETCH_MESSAGES_START
});

export const fetchMessagesSuccess = (messages) => ({
    type: MESSAGE_ACTIONS.FETCH_MESSAGES_SUCCESS,
    payload: messages
});

export const fetchMessagesFailure = (error) => ({
    type: MESSAGE_ACTIONS.FETCH_MESSAGES_FAILURE,
    payload: error
});

export const sendMessage = (message) => ({
    type: MESSAGE_ACTIONS.SEND_MESSAGE,
    payload: message
});

export const deleteMessage = (messageId) => ({
    type: MESSAGE_ACTIONS.DELETE_MESSAGE,
    payload: messageId
});

export const newMessageReceived = (message) => ({
    type: MESSAGE_ACTIONS.NEW_MESSAGE_RECEIVED,
    payload: message
});

export const markMessageRead = (messageId) => ({
    type: MESSAGE_ACTIONS.MARK_MESSAGE_READ,
    payload: messageId
});
