import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import axios from "axios";
import SockJS from 'sockjs-client';
import { formatRelativeTime, convertToUTCISOString } from './utils/timeUtils';

const MessageContent = ({ selectedUser, from, getUsersWithLastMessage }) => {
    const [newMessages, setNewMessages] = useState([]);
    const stompClient = useRef(null);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const client = useRef(null);
    const [message, setMessage] = useState("")
    // const [time, setTime] = useState(new Date().toISOString());
    const messages = useRef([])
    const [messageList, setMessageList] = useState([]);
    const [emojis, setEmjis] = useState(["🤩", "😎", "🥳", "😂", "🥰", "😡", "😊", "🛠️", "🌄", "👩‍💼", "🤑", "😕", "😩", "🤔", "😅", "😬"]);
    const scrollViewRef = useRef(null);
    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTop = scrollViewRef.current.scrollHeight;
        }
    };
    const [selectedFiles, setSelectedFiles] = useState({
        image: null,
        images: [],
        document: null,
    });
    const sendMessage = async () => {
        const time = new Date().toISOString()
        if (selectedFiles.image || selectedFiles.images.length > 0 || selectedFiles.document) {
            const fileName = await handleUpload()
            if (fileName) {
                const messageDto = {
                    message,
                    senderId: localStorage.getItem("userId"),
                    receiverId: selectedUser.userId,
                    time,
                    fileName
                };
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/messages`, messageDto, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    messages.current = [...messages.current, { message: message, type: "sent", time: time, filename: fileName }]
                    setMessageList(messages.current)
                    setMessage(""); // Clear the input
                    setMessage("");
                } catch (error) {
                    console.error("Failed to send message:", error);
                    alert("Failed to send message");
                }
            }
        } else {
            if (message == "") {
                return
            }
            const messageDto = {
                message,
                senderId: localStorage.getItem("userId"),
                receiverId: selectedUser.userId,
                time,
            };
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/messages`, messageDto, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                messages.current = [...messages.current, { message: message, type: "sent", time: time }]
                setMessageList(messages.current)
                setMessage(""); // Clear the input
                setMessage("");
            } catch (error) {
                console.error("Failed to send message:", error);
                alert("Failed to send message");
            }
        }
    }
    useEffect(() => {
        getUsersWithLastMessage()
        scrollToBottom()
    }, [messageList])
    const getMessages = async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages?senderId=${localStorage.getItem("userId")}&receiverId=${selectedUser.userId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(response.data, "response")
        messages.current = response.data; // Set the filename from the response
        setMessageList(messages.current)
    }
    useEffect(() => {
        try {
            client.current = new Client({
                webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws`),
                debug: function (str) {
                    console.log('STOMP: ' + str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });
            client.current.onConnect = (frame) => {
                setConnectionStatus('Connected');
                // Subscribe to the messages topic
                client.current.subscribe('/topic/messages', (message) => {
                    try {
                        const receivedMessage = JSON.parse(message.body);
                        // setNewMessages((prevMessages) => [...prevMessages, receivedMessage]);
                        console.log(receivedMessage, "receivedMessage")
                        if (receivedMessage.receiverId == localStorage.getItem("userId")) {
                            messages.current = [...messages.current, { message: receivedMessage.message, type: "received", time: receivedMessage.time, filename: receivedMessage.fileName }]
                            setMessageList(messages.current)
                        }
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });
            };

            client.current.onStompError = (frame) => {
                setConnectionStatus('Error: ' + frame.headers['message']);
            };

            client.current.onWebSocketError = (error) => {
                setConnectionStatus('WebSocket Error');
            };

            client.current.onDisconnect = () => {
                setConnectionStatus('Disconnected');
            };

            // Activate the client
            client.current.activate();
        } catch (error) {
            console.error('Error setting up WebSocket:', error);
            setConnectionStatus('Setup Error');
        }
    }, []);
    useEffect(() => {
        getMessages()
    }, [selectedUser])
    const handleFileChange = (event, type) => {
        const files = event.target.files;

        // Validate files based on the type
        if (type === "image") {
            if (files[0] && !files[0].type.startsWith("image/")) {
                alert("Please upload a valid image file.");
                return;
            }
            setSelectedFiles((prev) => ({ ...prev, image: files[0] }));
        } else if (type === "images") {
            const validFiles = Array.from(files).filter((file) =>
                file.type.startsWith("image/")
            );
            if (validFiles.length !== files.length) {
                alert("Some files are not valid images.");
            }
            setSelectedFiles((prev) => ({ ...prev, images: validFiles }));
        } else if (type === "document") {
            const validExtensions = ["application/pdf", "application/msword"];
            if (files[0] && !validExtensions.includes(files[0].type)) {
                alert("Please upload a valid document file (PDF or Word).");
                return;
            }
            setSelectedFiles((prev) => ({ ...prev, document: files[0] }));
        }
    };
    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSelectedFiles({
                image: null,
                images: [],
                document: null
            })
            return response.data;
        } catch (error) {
            console.error("Failed to upload file:", error);
            alert("Failed to upload file");
        }
    };
    const handleUpload = () => {
        if (selectedFiles.image) {
            const filePath = uploadFile(selectedFiles.image);
            return filePath;
        }
        if (selectedFiles.images.length > 0) {
            selectedFiles.images.forEach(uploadFile);
        }
        if (selectedFiles.document) {
            const filePath = uploadFile(selectedFiles.document);
            return filePath;
        }
    };
    return (
        <div className="flex-1">
            {/* <!-- chat heading --> */}
            <div className="flex items-center justify-between gap-2 w- px-6 py-3.5 z-10 border-b dark:border-slate-700 uk-animation-slide-top-medium">

                <div className="flex items-center gap-2 sm:gap-4">
                    {/* <!-- toggle for mobile --> */}
                    <button type="button" className="md:hidden" uk-toggle="target: #side-chat ; cls: max-md:-translate-x-full">
                        <ion-icon name="chevron-back-outline" className="-ml-4 text-2xl"></ion-icon>
                    </button>

                    <div className="relative cursor-pointer max-md:hidden" uk-toggle="target: .rightt ; cls: hidden">
                        <img src="/src/assets/images/avatars/avatar-6.jpg" alt="" className="w-8 h-8 rounded-full shadow" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 m-px bg-teal-500 rounded-full"></div>
                    </div>
                    <div className="cursor-pointer" uk-toggle="target: .rightt ; cls: hidden">
                        <div className="text-base font-bold">{selectedUser.name}</div>
                        <div className="text-xs font-semibold text-green-500"> Online</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button type="button" className="button__ico">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                    <button type="button" className="hover:bg-slate-100 p-1.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"></path>
                        </svg>
                    </button>
                    {!from &&
                        <button type="button" className="hover:bg-slate-100 p-1.5 rounded-full" uk-toggle="target: .rightt ; cls: hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 01-1.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                        </button>}

                </div>

            </div>

            {/* <!-- chats bubble --> */}
            <div className={`w-full p-5 py-10 overflow-y-auto md:${from ? "h-[330px]" : "h-[calc(100vh-139px)]"} ${from ? "h-[330px]" : "h-[calc(100vh-65px)]"}`} ref={scrollViewRef}>
                {!from &&
                    <div className="py-10 text-sm text-center lg:pt-8">
                        <img src="/src/assets/images/avatars/avatar-6.jpg" className="w-24 h-24 mx-auto mb-3 rounded-full" alt="" />
                        <div className="mt-8">
                            <div className="text-base font-medium text-black md:text-xl dark:text-white">{selectedUser.name}</div>
                        </div>
                        <div className="mt-3.5">
                            <a href="timeline.html" className="inline-block rounded-lg px-4 py-1.5 text-sm font-semibold bg-secondery">View profile</a>
                        </div>
                    </div>
                }
                <div className="space-y-6 text-sm font-medium">
                    {/* <div className="flex justify-center ">
                        <div className="text-sm font-medium text-gray-500 dark:text-white/70">
                            April 8,2023,6:30 AM
                        </div>
                    </div> */}
                    {messageList.map((message, index) => {
                        if (message.filename != null && message.filename != "" && (message.type == "received" || message.receiverId == localStorage.getItem("userId"))) {
                            const isImage = message.filename.match(/\.(jpg|jpeg|png|gif)$/i);
                            return (
                                <div key={index}>
                                    <div className="flex items-end gap-2">
                                        <img src="/src/assets/images/avatars/avatar-3.jpg" alt="" className="w-4 h-4 rounded-full shadow" />
                                        <div className="block rounded-[18px] border overflow-hidden p-3">
                                            {isImage ? (
                                                <div className="max-w-md">
                                                    <div className="relative max-w-full w-72">
                                                        <div className="relative" style={{ paddingBottom: '57.4286%' }}>
                                                            <div className="absolute inset-0 w-full h-full">
                                                                <img
                                                                    src={`${import.meta.env.VITE_API_URL}/api/files/${message.filename}`}
                                                                    alt={message.filename}
                                                                    className="block object-cover w-full h-full max-w-full max-h-52"
                                                                />
                                                            </div>
                                                        </div>
                                                        {message.message != "" && <div className="px-4 py-2 rounded-[20px] max-w-sm bg-secondery">{message.message}</div>}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <a
                                                        href={`${import.meta.env.VITE_API_URL}/api/files/${message.filename}`}
                                                        download
                                                        target='_blank'
                                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        {message.filename}
                                                    </a>
                                                    {message.message != "" && <div className="px-4 py-2 rounded-[20px] max-w-sm bg-secondery">{message.message}</div>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 ml-6 mt-1">{formatRelativeTime(message.time)}</div>
                                </div>
                            );
                        }
                        if (message.filename != null && message.filename != "" && (message.type == "sent" || message.senderId == localStorage.getItem("userId"))) {
                            const isImage = message.filename.match(/\.(jpg|jpeg|png|gif)$/i);
                            return (
                                <div key={index}>
                                    <div className="flex flex-row-reverse items-end gap-2">
                                        <img src="/src/assets/images/avatars/avatar-3.jpg" alt="" className="w-4 h-4 rounded-full shadow" />
                                        <div className="block rounded-[18px] border overflow-hidden p-3">
                                            {isImage ? (
                                                <div className="max-w-md">
                                                    <div className="relative max-w-full w-72">
                                                        <div className="relative" style={{ paddingBottom: '57.4286%' }}>
                                                            <div className="absolute inset-0 w-full h-full">
                                                                <img
                                                                    src={`${import.meta.env.VITE_API_URL}/api/files/${message.filename}`}
                                                                    alt={message.filename}
                                                                    className="block object-cover w-full h-full max-w-full max-h-52"
                                                                />
                                                            </div>
                                                        </div>
                                                        {message.message != "" && <div className="px-4 py-2 rounded-[20px] max-w-sm bg-secondery">{message.message}</div>}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <a
                                                        href={`${import.meta.env.VITE_API_URL}/api/files/${message.filename}`}
                                                        download
                                                        target='_blank'
                                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        {message.filename}
                                                    </a>
                                                    {message.message != "" && <div className="px-4 py-2 rounded-[20px] max-w-sm bg-secondery">{message.message}</div>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 text-right mr-6 mt-1">{formatRelativeTime(message.time)}</div>
                                </div>
                            );
                        }
                        if (message.type == "received" || message.receiverId == localStorage.getItem("userId")) {
                            return (
                                <div key={index}>
                                    <div className="flex gap-3">
                                        <img src="/src/assets/images/avatars/avatar-2.jpg" alt="" className="rounded-full shadow w-9 h-9" />
                                        <div className="px-4 py-2 rounded-[20px] max-w-sm bg-secondery">{message.message}</div>
                                    </div>
                                    <div className="text-xs text-gray-500 ml-12 mt-1">{formatRelativeTime(message.time)}</div>
                                </div>
                            )
                        }
                        if (message.type == "sent" || message.senderId == localStorage.getItem("userId")) {
                            return (
                                <div key={index}>
                                    <div className="flex flex-row-reverse items-end gap-2">
                                        <img src="/src/assets/images/avatars/avatar-3.jpg" alt="" className="w-5 h-5 rounded-full shadow" />
                                        <div className="px-4 py-2 rounded-[20px] max-w-sm bg-gradient-to-tr from-sky-500 to-blue-500 text-white shadow">{message.message}</div>
                                    </div>
                                    <div className="text-xs text-gray-500 text-right mr-6 mt-1">{formatRelativeTime(message.time)}</div>
                                </div>
                            )
                        }
                    })}
                </div>

            </div>

            {/* <!-- sending message area --> */}
            <div className="flex items-center gap-2 p-2 overflow-hidden md:gap-4 md:p-3">

                <div id="message__wrap" className="flex items-center gap-2 h-full dark:text-white -mt-1.5">

                    <button type="button" className="shrink-0">
                        <ion-icon className="flex text-3xl" name="add-circle-outline"></ion-icon>
                    </button>
                    <div className="dropbar pt-36 h-60 bg-gradient-to-t via-white from-white via-30% from-30% dark:from-slate-900 dark:via-900" uk-drop="stretch: x; target: #message__wrap ;animation:  slide-bottom ;animate-out: true; pos: top-left; offset:10 ; mode: click ; duration: 200 ">

                        <div className="flex justify-center gap-5 p-3 sm:w-full" uk-scrollspy="target: > button; cls: uk-animation-slide-bottom-small; delay: 100;repeat:true ">

                            {/* Single Image */}
                            <button
                                type="button"
                                className="bg-sky-50 text-sky-600 border border-sky-100 shadow-sm p-2.5 rounded-full shrink-0 duration-100 hover:scale-[1.15] dark:bg-dark3 dark:border-0"
                                onClick={() => document.getElementById("file").click()}
                            >
                                <ion-icon className="flex text-3xl" name="image"></ion-icon>
                            </button>
                            <input
                                type="file"
                                id="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "image")}
                            />

                            {/* Document */}
                            <button
                                type="button"
                                className="bg-pink-50 text-pink-600 border border-pink-100 shadow-sm p-2.5 rounded-full shrink-0 duration-100 hover:scale-[1.15] dark:bg-dark3 dark:border-0"
                                onClick={() => document.getElementById("document").click()}
                            >
                                <ion-icon className="flex text-3xl" name="document-text"></ion-icon>
                            </button>
                            <input
                                type="file"
                                id="document"
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleFileChange(e, "document")}
                            />
                        </div>
                    </div>
                    <button type="button" className="shrink-0">
                        <ion-icon className="flex text-3xl" name="happy-outline"></ion-icon>
                    </button>
                    <div className="p-2 dropbar" uk-drop="stretch: x; target: #message__wrap ;animation: uk-animation-scale-up uk-transform-origin-bottom-left ;animate-out: true; pos: top-left ; offset:2; mode: click ; duration: 200 ">
                        <div className="pr-0 bg-white border shadow-lg sm:w-60 rounded-xl dark:border-slate-700 dark:bg-dark3">
                            <h4 className="p-3 pb-0 text-sm font-semibold">Send Imogi</h4>
                            <div className="grid grid-cols-5 p-3 overflow-y-auto text-xl text-center max-h-44">
                                {emojis.map(emoji => <div onClick={() => {
                                    setMessage(message + emoji)
                                }} className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200" key={emoji}> {emoji} </div>)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative flex-1">
                    <textarea placeholder="Write your message" rows="1" className="w-full p-2 px-4 rounded-full resize-none bg-secondery" value={message} onChange={(e) => {
                        setMessage(e.target.value)
                    }}></textarea>
                    <button type="button" className="text-black shrink-0 p-2 absolute right-0.5 top-0" onClick={() => {
                        sendMessage()
                    }}>
                        <ion-icon className="flex text-xl" name="send-outline"></ion-icon>
                    </button>
                </div>
                <button type="button" className="flex h-full dark:text-white">
                    <ion-icon className="flex -mt-3 text-3xl" name="heart-outline"></ion-icon>
                </button>

            </div>

        </div>
    );
};

export default MessageContent;