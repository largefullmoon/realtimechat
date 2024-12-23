// Initial state
const initialState = {
    windows: [] // Array of {senderId, receiverId, isCollapsed} objects
};

// Action Types
export const WINDOW_ACTIONS = {
    ADD_WINDOW: 'ADD_WINDOW',
    REMOVE_WINDOW: 'REMOVE_WINDOW',
    TOGGLE_WINDOW: 'TOGGLE_WINDOW'
};

// Window Reducer
const windowReducer = (state = initialState, action) => {
    switch (action.type) {
        case WINDOW_ACTIONS.ADD_WINDOW: {
            // Check if window already exists
            const windowExists = state.windows.some(
                window => window.senderId === action.payload.senderId && 
                         window.receiverId === action.payload.receiverId
            );

            if (windowExists) {
                return state;
            }

            return {
                ...state,
                windows: [...state.windows, { ...action.payload, isCollapsed: false }]
            };
        }
        case WINDOW_ACTIONS.REMOVE_WINDOW: {
            const { senderId, receiverId } = action.payload;
            return {
                ...state,
                windows: state.windows.filter(
                    window => !(window.senderId === senderId && window.receiverId === receiverId)
                )
            };
        }
        case WINDOW_ACTIONS.TOGGLE_WINDOW: {
            const { senderId, receiverId } = action.payload;
            return {
                ...state,
                windows: state.windows.map(window => 
                    window.senderId === senderId && window.receiverId === receiverId
                        ? { ...window, isCollapsed: !window.isCollapsed }
                        : window
                )
            };
        }
        default:
            return state;
    }
};

export default windowReducer;
