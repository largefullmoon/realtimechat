import React from 'react';
import { useDispatch } from 'react-redux';
import MessageContent from '../MessageContent';
import { removeWindow, minimizeWindow } from '../store/actions/windowActions';

const ChatWindow = ({ senderId, receiverId, position }) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(removeWindow({ senderId, receiverId }));
    };

    const handleMinimize = () => {
        dispatch(minimizeWindow({ senderId, receiverId }));
    };

    return (
        <div className="chat-window" style={{
            position: 'fixed',
            bottom: '20px',
            right: `${position * 320 + 20}px`,
            width: '300px',
            height: '500px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000
        }}>
            <div className="chat-header" style={{
                padding: '10px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span>Chat with User {receiverId}</span>
                <div>
                    <button 
                        onClick={handleMinimize}
                        style={{
                            marginRight: '10px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        _
                    </button>
                    <button 
                        onClick={handleClose}
                        style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>
                </div>
            </div>
            <div className="chat-content" style={{
                flex: 1,
                overflow: 'hidden'
            }}>
                <MessageContent 
                    selectedUser={{ id: receiverId }}
                    from={true}
                    style={{
                        height: '100%',
                        overflow: 'auto'
                    }}
                />
            </div>
        </div>
    );
};

export default ChatWindow;
