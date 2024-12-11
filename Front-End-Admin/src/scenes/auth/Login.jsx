import React, { useState } from 'react'
import img from '../../assets/auth-bg.jpg'
import imgIcon from "../../assets/icon.png"
import img1 from '../../assets/7677.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import SummaryApi from '../../common'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import ROLE from '../../common/role'


const Login = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
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
        const dataReponse = await fetch(SummaryApi.signIn.url, {
            method: SummaryApi.signIn.method,
            credentials: "include",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const dataApi = await dataReponse.json()
        if (dataApi?.success) {
            if (dataApi.role === ROLE.GENARAL) {
                return toast.error("Bạn không có quyền truy cập")
            } else {
                toast.success(dataApi?.message)
                localStorage.setItem("token", dataApi.token);
                localStorage.setItem("role", dataApi.role);
                if (dataApi.role === 'ADMIN') {
                    navigate('/dashboard');
                } else if (dataApi.role === 'productManager') {
                    navigate('/product');
                } else if (dataApi.role === 'orderManager') {
                    navigate('/order-processing');
                } else if (dataApi.role === 'deliveryStaff') {
                    navigate('/delivery-staff')
                }
            }

        } else if (dataApi?.error) {
            toast.error(dataApi?.message)
        }
    }

    return (
        <div className="">
            <div className='relative min-h-screen max-h-screen min-w-screen flex justify-center items-center '
                style={{
                    background: `url(${img}) no-repeat center`,
                }}>
                <div className="shadow-xl max-w-[800px] my-[5%] mx-auto relative flex flex-wrap">
                    <div className="w-full bg-transparent lg:w-7/12 md:w-5/12 bg-cover bg-center min-h-[400px]"
                        style={{
                            background: `url(${img1})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",

                        }}
                    >
                    </div>

                    <div className="w-full lg:w-5/12 md:w-7/12 bg-white">
                        <div className="p-9">
                            <div className="flex justify-center items-center">
                                <img src={imgIcon} alt="wrapkit" className="h-15 w-15" />
                            </div>
                            <h2 className="mt-5 text-center text-2xl font-bold text-gray-800">Đăng Nhập</h2>
                            <p className="text-center text-gray-600 font-semibold">Nhập địa chỉ email và mật khẩu của bạn để truy cập vào bảng quản trị.</p>

                            <form className="mt-6" onSubmit={handleSubmit}>
                                <div className="flex flex-wrap">
                                    <div className="w-full mb-4">
                                        <input type="email" name='email' onChange={handleOnChange} value={data.email} className="border rounded w-full p-2  font-semibold text-black" id="email" placeholder="Email" />
                                    </div>

                                    <div className="w-full mb-4 relative flex items-center">
                                        <input name="password" onChange={handleOnChange} value={data.password} type={!showPassword ? "password" : "text"} className="border rounded w-full p-2 font-semibold text-black" id="pwd" placeholder="Password" />
                                        <div className='cursor-pointer text-xl absolute text-black right-3' onClick={() => setShowPassword((preve) => !preve)}>
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
                                        <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded font-semibold">Đăng Nhập</button>
                                    </div>

                                    <div className="w-full text-black font-bold text-sm text-center mt-5">
                                        Bạn chưa có tài khoản? <Link to={"/register"} className="text-red-600 hover:text-red-700">Đăng Ký</Link>
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

export default Login