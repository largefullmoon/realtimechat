import React, { useState, useRef } from 'react';
import Vector from '../assets/Vector.png';
import Ellipse from '../assets/Ellipse.png';
import Ellipse1 from '../assets/Ellipse1.png';
import Ellipse2 from '../assets/Ellipse2.png';
import Copy from '../assets/CopyIcone.svg';
import User from '../assets/user.svg';
import Lock from '../assets/lock.svg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const SignIn = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const token = useRef(null);
    const isLoading = useRef(false)
    const signin = async () => {
        if (name == "" || password == "") {
            toast.warning("please input all field")
        } else {
            console.log(name, password)
            try {
                const response = await axios.post('/api/auth/login', {
                    username: name,
                    password: password,
                    email: ''
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                console.log(response, "response")
                if (response.status === 200) {
                    token.current = response.data
                    toast.success("Successfully Athenticated")
                    await localStorage.setItem('token', response.data);
                    await localStorage.setItem('isSigned', true);
                    navigate('/dashboard');
                } else {
                    toast.error("Authentication failed")
                }
            } catch (error) {
                toast.error("Authentication failed")
            }
        }
    }
    return (
        <div className='w-screen h-screen bg-[#0F908B] flex items-center justify-center'>
            <img src={Vector} alt="Vector" className="w-[864px] h-full absolute top-0 right-0" />
            <img src={Ellipse} alt="Ellipse" className="w-[362px] h-[362px] absolute bottom-0 left-0" />
            <img src={Ellipse1} alt="Ellipse" className="w-[286px] h-[286px] absolute bottom-0 left-0" />
            <img src={Ellipse2} alt="Ellipse2" className="w-[219px] h-[219px] absolute bottom-0 left-0" />
            <div className='w-[300px] h-fit min-h-[475px] flex justify-between items-center flex-col z-10'>
                <Copy />
                <div className='text-white text-[16px] font-[500] mb-5'>
                    Sign In
                </div>
                <div className='relative mb-5'>
                    <User className='absolute w-5 h-5 top-3 left-1' />
                    <input onChange={(e) => {
                        setName(e.target.value)
                    }} type="text" className='rounded-md  focus:border-white focus:outline-none pl-8 border border-white w-[300px] h-[45px] bg-[#088883] text-white text-[14px]' placeholder='USERNAME' />
                </div>
                <div className='relative mb-10'>
                    <Lock className='absolute w-5 h-5 top-3 left-1' />
                    <input onChange={(e) => {
                        setPassword(e.target.value)
                    }} type="password" className='rounded-md focus:border-white focus:outline-none pl-8 border border-white w-[300px] h-[45px] bg-[#088883] text-white text-[14px]' placeholder='PASSWORD' />
                </div>
                <button onClick={(() => {
                    signin()
                })} className='mb-5 rounded-md bg-white text-[#207976] text-[16px] font-[600] text-center w-[300px] h-[45px]'>
                    Login
                </button>
            </div>
        </div>
    );
};

export default SignIn;