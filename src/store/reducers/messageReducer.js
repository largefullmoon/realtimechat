// Initial state
const initialState = {
    messages: [],
    loading: false,
    error: null,
    newMessages: [],
    unreadCount: 0
};

// Action Types
export const MESSAGE_ACTIONS = {
    FETCH_MESSAGES_START: 'FETCH_MESSAGES_START',
    FETCH_MESSAGES_SUCCESS: 'FETCH_MESSAGES_SUCCESS',
    FETCH_MESSAGES_FAILURE: 'FETCH_MESSAGES_FAILURE',
    SEND_MESSAGE: 'SEND_MESSAGE',
    DELETE_MESSAGE: 'DELETE_MESSAGE',
    NEW_MESSAGE_RECEIVED: 'NEW_MESSAGE_RECEIVED',
    MARK_MESSAGE_READ: 'MARK_MESSAGE_READ'
};

// Message Reducer
const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case MESSAGE_ACTIONS.FETCH_MESSAGES_START:
            return {
                ...state,
                loading: true,
                error: null
            };
        case MESSAGE_ACTIONS.FETCH_MESSAGES_SUCCESS:
            return {
                ...state,
                loading: false,
                messages: action.payload,
                error: null
            };
        case MESSAGE_ACTIONS.FETCH_MESSAGES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case MESSAGE_ACTIONS.SEND_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload]
            };
        case MESSAGE_ACTIONS.DELETE_MESSAGE:
            return {
                ...state,
                messages: state.messages.filter(message => message.id !== action.payload)
            };
        case MESSAGE_ACTIONS.NEW_MESSAGE_RECEIVED:
            return {
                ...state,
                newMessages: [...state.newMessages, action.payload],
                unreadCount: state.unreadCount + 1
            };
        case MESSAGE_ACTIONS.MARK_MESSAGE_READ:
            return {
                ...state,
                newMessages: state.newMessages.filter(msg => msg.id !== action.payload),
                unreadCount: Math.max(0, state.unreadCount - 1)
            };
        default:
            return state;
    }
};

export default messageReducer;
