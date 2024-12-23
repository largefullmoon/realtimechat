import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addWindow } from '../store/actions/windowActions';
import axios from 'axios';

const UserListModal = ({ }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch users from your API
        const fetchUsers = async () => {
            const response = await axios.get("http://localhost:8080/api/users?myId="+localStorage.getItem("userId"), {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setUsers(response.data); // Set the filename from the response
        };

        fetchUsers();
    }, []);

    const handleUserClick = (receiverId) => {
        dispatch(addWindow({ senderId: 1, receiverId, receivedUser: users.filter(user => user.userId === receiverId)[0] }));
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '0px',
            right: '0px',
            width: '300px',
            height: isExpanded ? '550px' : '50px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            zIndex: 1000
        }}>
            {/* Header */}
            <div style={{
                padding: '10px',
                borderBottom: isExpanded ? '1px solid #eee' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'black'
            }}>
                <span style={{ fontWeight: 'bold' }} className='text-white'>Messages</span>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className='text-white'
                    style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: '5px',
                        marginLeft: isExpanded ? '0' : '0',
                        marginRight: isExpanded ? '0' : '0'
                    }}
                >
                    {isExpanded ? '◀' : '▶'}
                </button>
            </div>

            {/* User List */}
            {isExpanded && (
                <div style={{
                    height: 'calc(100% - 50px)',
                    overflow: 'auto',
                    padding: '10px'
                }}>
                    {users.map((user, index) => (
                        <div
                            key={index}
                            onClick={() => handleUserClick(user.userId)}
                            style={{
                                padding: '10px',
                                borderBottom: '1px solid #eee',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                ':hover': {
                                    backgroundColor: '#f8f9fa'
                                }
                            }}
                        >
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: '#e9ecef',
                                marginRight: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {user.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{user.username || 'User ' + user.id}</div>
                                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                    {user.status || 'Online'}
                                </div>
                            </div>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#28a745',
                                marginLeft: 'auto'
                            }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserListModal;
