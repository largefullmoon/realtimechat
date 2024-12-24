import React, { useState, useCallback, useEffect, useRef } from 'react';
import './css/style.css';
import axios from "axios";
import MessageContent from './MessageContent'
import { formatRelativeTime } from './utils/timeUtils';

const Message = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const getUsersWithLastMessage = async () => {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users?myId=${userId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        setUsers(response.data); // Set the filename from the response
    }

    const handleUserSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        // Filter users based on username or last message
        const filtered = users.filter(user => 
            user.username.toLowerCase().includes(term) || 
            (user.lastMessage && user.lastMessage.toLowerCase().includes(term))
        );

        setFilteredUsers(filtered);
    };

    // Use filteredUsers when search term is not empty, otherwise use original users list
    const displayUsers = searchTerm ? filteredUsers : users;

    useEffect(()=>{
        setSelectedUser(users[0])
    },[users])

    useEffect(() => {
        getUsersWithLastMessage()
    }, [])

    return (
        <div className=''>
            {/* <!-- main contents --> */}
            <main id="site__main">

                <div className="relative overflow-hidden border dark:border-slate-700">

                    <div className="flex bg-white dark:bg-dark2">

                        {/* <!-- sidebar --> */}
                        <div className="md:w-[360px] relative border-r dark:border-slate-700">

                            <div id="side-chat" className="top-0 left-0 z-50 bg-white max-md:fixed max-md:w-5/6 max-md:h-screen max-md:shadow max-md:-translate-x-full dark:bg-dark2">

                                {/* <!-- heading title --> */}
                                <div className="p-4 border-b dark:border-slate-700">

                                    <div className="flex items-center justify-between mt-2">

                                        <h2 className="ml-1 text-2xl font-bold text-black dark:text-white"> Chats </h2>

                                        {/* <!-- right action buttons --> */}
                                        <div className="flex items-center gap-2.5">


                                            <button className="group">
                                                <ion-icon name="settings-outline" className="flex text-2xl group-aria-expanded:rotate-180"></ion-icon>
                                            </button>
                                            <div className="md:w-[270px] w-full" uk-dropdown="pos: bottom-left; offset:10; animation: uk-animation-slide-bottom-small">
                                                <nav>
                                                    <a href="#"> <ion-icon className="-ml-1 text-2xl shrink-0" name="checkmark-outline"></ion-icon> Mark all as read </a>
                                                    <a href="#"> <ion-icon className="-ml-1 text-2xl shrink-0" name="notifications-outline"></ion-icon> notifications setting </a>
                                                    <a href="#"> <ion-icon className="-ml-1 text-xl shrink-0" name="volume-mute-outline"></ion-icon> Mute notifications </a>
                                                </nav>
                                            </div>

                                            <button className="">
                                                <ion-icon name="checkmark-circle-outline" className="flex text-2xl"></ion-icon>
                                            </button>

                                            {/* <!-- mobile toggle menu --> */}
                                            <button type="button" className="md:hidden" uk-toggle="target: #side-chat ; cls: max-md:-translate-x-full">
                                                <ion-icon name="chevron-down-outline"></ion-icon>
                                            </button>

                                        </div>

                                    </div>

                                    {/* <!-- search --> */}
                                    <div className="relative mt-4">
                                        <div className="absolute flex translate-y-1/2 left-3 bottom-1/2"><ion-icon name="search" className="text-xl"></ion-icon></div>
                                        <input 
                                            type="text" 
                                            placeholder="Search users" 
                                            value={searchTerm}
                                            onChange={handleUserSearch}
                                            className="w-full !pl-10 !py-2 !rounded-lg" 
                                        />
                                    </div>

                                </div>


                                {/* <!-- users list --> */}
                                <div className="space-y-2 p-2 overflow-y-auto md:h-[calc(100vh-139px)] h-[calc(100vh-130px)]">
                                    {displayUsers.map((user, index) => (
                                        <a 
                                            key={user.userId} 
                                            href="#" 
                                            className="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery" 
                                            onClick={() => {
                                                setSelectedUser(user);
                                            }}
                                        >
                                            <div className="relative w-14 h-14 shrink-0">
                                                <img 
                                                    src={`/src/assets/images/avatars/avatar-${user.userId}.jpg`} 
                                                    alt="" 
                                                    className="object-cover w-full h-full rounded-full" 
                                                />
                                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border border-white rounded-full dark:border-slate-800"></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <div className="mr-auto text-sm font-medium text-black dark:text-white">{user.username}</div>
                                                    <div className="text-xs font-light text-gray-500 dark:text-white/70">{formatRelativeTime(user.messageTime)}</div>
                                                    {!user.isRead && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full dark:bg-slate-700"></div>}
                                                </div>
                                                <div className="overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap">{user.lastMessage}</div>
                                            </div>
                                        </a>
                                    ))}
                                    
                                    {/* Show message when no users match search */}
                                    {displayUsers.length === 0 && searchTerm && (
                                        <div className="text-center text-gray-500 py-4">
                                            No users found matching "{searchTerm}"
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* <!-- overly --> */}
                            <div id="side-chat" className="fixed inset-0 z-40 w-full h-full bg-slate-100/40 backdrop-blur dark:bg-slate-800/40 max-md:-translate-x-full md:hidden" uk-toggle="target: #side-chat ; cls: max-md:-translate-x-full"></div>
                        </div>
                        {/* <!-- message center --> */}
                        <MessageContent selectedUser={selectedUser} from={false} getUsersWithLastMessage={getUsersWithLastMessage}/>

                        {/* <!-- user profile right info --> */}
                        <div className="absolute top-0 right-0 z-10 hidden w-full h-full transition-transform rightt">
                            <div className="w-[360px] border-l shadow-lg h-screen bg-white absolute right-0 top-0 uk-animation-slide-right-medium delay-200 z-50 dark:bg-dark2 dark:border-slate-700">

                                <div className="w-full h-1.5 bg-gradient-to-r to-purple-500 via-red-500 from-pink-500 -mt-px"></div>

                                <div className="py-10 pt-20 text-sm text-center">
                                    <img src="/src/assets/images/avatars/avatar-3.jpg" className="w-24 h-24 mx-auto mb-3 rounded-full" alt="" />
                                    <div className="mt-8">
                                        <div className="text-base font-medium text-black md:text-xl dark:text-white">{selectedUser && selectedUser.username}</div>
                                    </div>
                                    <div className="mt-5">
                                        <a href="timeline.html" className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold bg-secondery">View profile</a>
                                    </div>
                                </div>

                                <div className="opacity-80 dark:border-slate-700">

                                    <ul className="p-3 text-base font-medium">
                                        <li>
                                            <div className="flex items-center w-full gap-5 p-3 rounded-md hover:bg-secondery">
                                                <ion-icon name="notifications-off-outline" className="text-2xl"></ion-icon> Mute Notification
                                                <label className="ml-auto cursor-pointer switch"> <input type="checkbox" /><span className="switch-button !relative" ></span></label>
                                            </div>
                                        </li>
                                        <li> <button type="button" className="flex items-center w-full gap-5 p-3 rounded-md hover:bg-secondery"> <ion-icon name="flag-outline" className="text-2xl"></ion-icon> Report     </button></li>
                                        <li> <button type="button" className="flex items-center w-full gap-5 p-3 rounded-md hover:bg-secondery"> <ion-icon name="settings-outline" className="text-2xl"></ion-icon> Ignore messages   </button> </li>
                                        <li> <button type="button" className="flex items-center w-full gap-5 p-3 rounded-md hover:bg-secondery"> <ion-icon name="stop-circle-outline" className="text-2xl"></ion-icon> Block    </button> </li>
                                        <li> <button type="button" className="flex items-center w-full gap-5 p-3 text-red-500 rounded-md hover:bg-red-50"> <ion-icon name="trash-outline" className="text-2xl"></ion-icon> Delete Chat   </button> </li>
                                    </ul>

                                    {/* <!-- close button --> */}
                                    <button type="button" className="absolute top-0 right-0 p-2 m-4 rounded-full bg-secondery" uk-toggle="target: .rightt ; cls: hidden">
                                        <ion-icon name="close" className="flex text-2xl"></ion-icon>
                                    </button>

                                </div>
                            </div>
                            {/* <!-- overly --> */}
                            <div className="absolute w-full h-full bg-slate-100/40 backdrop-blur dark:bg-slate-800/40" uk-toggle="target: .rightt ; cls: hidden"></div>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
};

export default Message;