import React from 'react';
import { useDispatch } from 'react-redux';
import { maximizeWindow } from '../store/actions/windowActions';

const MinimizedWindow = ({ senderId, receiverId, position }) => {
    const dispatch = useDispatch();

    const handleMaximize = () => {
        dispatch(maximizeWindow({ senderId, receiverId }));
    };

    return (
        <div 
            onClick={handleMaximize}
            style={{
                position: 'fixed',
                bottom: '0',
                right: `${position * 300 + 20}px`,
                width: '300px',
                height: '40px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                zIndex: 1000
            }}
        >
            <span>Chat with User {receiverId}</span>
        </div>
    );
};

export default MinimizedWindow;
