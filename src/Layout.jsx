import React, {useRef} from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserListModal from './components/UserListModal';
import CollapsibleWindow from './components/CollapsibleWindow';

const Layout = () => {
    const windows = useSelector(state => state.windows.windows);
    return (
        <div>
            <Outlet />
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
        </div>
    );
};

export default Layout;