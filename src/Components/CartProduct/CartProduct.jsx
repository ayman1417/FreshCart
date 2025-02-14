import React, { useContext, useEffect, useState } from 'react'
import { baseUrl } from '../../Helper/helper.module';
import { Button as NextBtn } from "@nextui-org/react";
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import confetti from 'canvas-confetti';

export default function CartProduct({ index, cartProduct, reduceQuantity, icreaseQuantity, bounce, setBounce, removeProductCart }) {
    const [count, setCount] = useState(cartProduct.count);
    useEffect(() => {
        setCount(cartProduct.count)
    }, [cartProduct.count])
    return (
        <div>
            <div key={cartProduct?.product.id} className=" relative grid grid-cols-1 lg:grid-cols-2 min-[550px]:gap-6 border-t border-gray-200 py-6">
                <div className="flex items-center flex-col min-[550px]:flex-row gap-3 min-[550px]:gap-6 w-full max-xl:justify-center max-xl:max-w-xl max-xl:mx-auto">
                    <div className="img-box"><img src={cartProduct?.product.imageCover} alt="perfume bottle image" className="xl:w-[140px] rounded-xl object-cover" /></div>
                    <div className="pro-data w-full max-w-sm ">
                        <h5 className="font-semibold text-xl leading-8 text-black max-[550px]:text-center">
                            {cartProduct?.product.title}
                        </h5>
                        <p className="font-normal text-lg leading-8 text-gray-500 my-2 min-[550px]:my-3 max-[550px]:text-center">
                            {cartProduct?.product.category.name}</p>
                        <h6 className="font-medium text-lg leading-8 text-indigo-600  max-[550px]:text-center">${cartProduct?.price}</h6>
                    </div>
                </div>
                <div className="flex items-center flex-col min-[550px]:flex-row w-full max-xl:max-w-xl max-xl:mx-auto gap-2">

                    <div className="flex items-center w-full mx-auto justify-center">
                        {/* - */}
                        <button disabled={count == 1} onClick={() => { setCount(count - 1); reduceQuantity(cartProduct?.product.id, count - 1) }} className="group rounded-l-full px-6 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-300 hover:bg-gray-50">
                            <svg className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black" xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22" fill="none">
                                <path d="M16.5 11H5.5" stroke strokeWidth="1.6" strokeLinecap="round" />
                                <path d="M16.5 11H5.5" stroke strokeOpacity="0.2" strokeWidth="1.6" strokeLinecap="round" />
                                <path d="M16.5 11H5.5" stroke strokeOpacity="0.2" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </button>
                        <input disabled type="text" className="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full max-w-[118px] min-w-[80px] placeholder:text-gray-900 py-[15px] text-center bg-transparent" placeholder={count} />
                        {/* + */}
                        <button onClick={() => { setCount(count + 1); icreaseQuantity(cartProduct?.product.id, count + 1) }} className="group rounded-r-full px-6 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-300 hover:bg-gray-50">
                            <svg className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black" xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22" fill="none">
                                <path d="M11 5.5V16.5M16.5 11H5.5" stroke strokeWidth="1.6" strokeLinecap="round" />
                                <path d="M11 5.5V16.5M16.5 11H5.5" stroke strokeOpacity="0.2" strokeWidth="1.6" strokeLinecap="round" />
                                <path d="M11 5.5V16.5M16.5 11H5.5" stroke strokeOpacity="0.2" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                    <h6 className="text-indigo-600 font-manrope font-bold text-2xl leading-9 w-full max-w-[176px] text-center">
                        ${cartProduct?.price * count}
                    </h6>
                </div>
                {/*  Delete Product */}
                <button onClick={() => removeProductCart(cartProduct?.product.id, index)} className='absolute end-10 top-5  text-red-500 '>
                    <i className={`fa-solid fa-trash-can  text-xl ${bounce === index ? "fa-bounce" : ""}`}></i>
                </button>
            </div>
        </div>
    )
}
