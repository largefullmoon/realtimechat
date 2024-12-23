import React from 'react';
import { useDispatch } from 'react-redux';
import { removeWindow, toggleWindow } from '../store/actions/windowActions';
import MessageContent from '../MessageContent';

const CollapsibleWindow = ({ senderId, receiverId, position, isCollapsed, receivedUser }) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(removeWindow({ senderId, receiverId }));
    };

    const handleToggle = () => {
        dispatch(toggleWindow({ senderId, receiverId }));
    };

    return (
        <div className="chat-window" style={{
            position: 'fixed',
            bottom: '0',
            right: `${(position + 1) * 300}px`,
            width: '300px',
            height: isCollapsed ? '40px' : '500px',
            backgroundColor: 'white',
            borderRadius: isCollapsed ? '8px 8px 0 0' : '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            transition: 'height 0.3s ease'
        }}>
            <div className="chat-header" style={{
                padding: '10px',
                borderBottom: !isCollapsed ? '1px solid #eee' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: isCollapsed ? '#f0f0f0' : 'white',
                cursor: 'pointer',
                height: '40px'
            }}
                onClick={handleToggle}
            >
                <span>{receivedUser.username}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {!isCollapsed && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClose();
                            }}
                            className='font-bold text-[18px]'
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>
            {!isCollapsed && (
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
            )}
        </div>
    );
};

export default CollapsibleWindow;
