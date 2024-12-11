import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import img from '../../assets/auth-bg.jpg'
import imgIcon from "../../assets/icon.png"
import img1 from '../../assets/7679.jpg'
import { toast } from 'react-toastify'
import SummaryApi from '../../common'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: "",
        name: "",
        phone:"",
    })
    const naviagte = useNavigate()
    const handleOnChange = (event) => {
        const { name, value } = event.target
        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        const dataResponse = await fetch(SummaryApi.signUp.url, {
            method: SummaryApi.signUp.method,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)
        })

        const dataAPI = await dataResponse.json();
        if (dataAPI.success) {
            toast.success(dataAPI.message)
            naviagte("/")
        } else if (dataAPI.error) {
            toast.error(dataAPI.message)
        }
    }

    return (
        <div className="">
            <div className='relative min-h-screen max-h-screen min-w-screen flex justify-center items-center'
                style={{
                    background: `url(${img}) no-repeat center `,
                }}>
                <div className="shadow-xl max-w-[800px] my-[5%] mx-auto relative flex flex-wrap">
                    <div className="w-full lg:w-7/12 md:w-5/12 bg-cover bg-center min-h-[400px]"
                        style={{
                            background: `url(${img1}) no-repeat`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                    </div>

                    <div className="w-full md:w-5/12 bg-white">
                        <div className="p-9">
                            <div className="flex justify-center items-center">
                                <img src={imgIcon} alt="wrapkit" className="h-15 w-15" />
                            </div>
                            <h2 className="mt-5 text-center text-2xl font-semibold text-gray-800">Đăng Ký miễn phí</h2>

                            <form className="mt-6" onSubmit={handleSubmit}>
                                <div className="flex flex-wrap">
                                    <div className="w-full mb-4">
                                        <input type="email" value={data.email} onChange={handleOnChange} name='email' required className="border rounded w-full p-2 font-semibold text-black" id="email" placeholder="Email" />
                                    </div>

                                    <div className="w-full mb-4">
                                        <input type="text" value={data.name} onChange={handleOnChange} name='name' required className="border rounded w-full p-2 font-semibold text-black" id="yourName" placeholder="Tên Đăng Nhập" />
                                    </div>

                                    <div className="w-full mb-4">
                                        <input type="text" value={data.phone} onChange={handleOnChange} name='phone' required className="border rounded w-full p-2 font-semibold text-black" id="yourName" placeholder="Số Điện Thoại" />

                                    </div>

                                    <div className="w-full mb-4 relative flex items-center">
                                        <input value={data.password} onChange={handleOnChange} name='password' type={!showPassword ? "password" : "text"} required className="border rounded w-full p-2 font-semibold text-black" id="pwd" placeholder="Password" />
                                        <div className='cursor-pointer text-xl text-black absolute right-3' onClick={() => setShowPassword((preve) => !preve)}>
                                            <span>
                                                {
                                                    showPassword
                                                        ?
                                                        (
                                                            <FaEye />
                                                        )
                                                        :
                                                        (
                                                            <FaEyeSlash />
                                                        )
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full text-center">
                                        <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded font-semibold">Đăng Ký</button>
                                    </div>

                                    <div className="w-full font-semibold mt-10 text-black text-center text-sm">
                                        Bạn đã có đã tài khoản? <Link to={"/"} className="text-red-600 hover:text-red-700">Đăng Nhập</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Register