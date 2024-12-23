import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import UserListModal from './components/UserListModal';
import CollapsibleWindow from './components/CollapsibleWindow';

const Layout = () => {
    const windows = useSelector(state => state.windows.windows);
    const location = useLocation();
    const isMessagePage = location.pathname === '/message';

    return (
        <div>
            <Outlet />
            {!isMessagePage && (
                <>
                    {/* User List Modal */}
                    <UserListModal />
                    {/* Chat Windows */}
                    <div>
                        {windows.map((window, index) => (
                            <CollapsibleWindow
                                key={`${window.senderId}-${window.receiverId}`}
                                senderId={window.senderId}
                                receiverId={window.receiverId}
                                position={index}
                                receivedUser={window.receivedUser}
                                isCollapsed={window.isCollapsed}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Layout;