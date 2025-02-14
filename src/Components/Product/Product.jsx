import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { baseUrl } from '../../Helper/helper.module'
import { Bounce, toast } from 'react-toastify'
import { Button as NextBtn } from "@nextui-org/react";
import { logContext } from '../../Contexts/LogContext'
import { useQueryClient } from '@tanstack/react-query'

export default function Product({ product }) {
    const navigate = useNavigate()
    const [isload, setIsload] = useState();
    const { wishlist, setWishlist } = useContext(logContext);
    const queryClient = useQueryClient();


    function addToCart(productId, event) {
        if (event?.stopPropagation) {
            event.stopPropagation();
        }
        console.log("Adding product with ID:", productId); // Debugging

        setIsload(true)
        axios
            .post(`${baseUrl}/api/v1/cart`, { productId }, {
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                console.log(res);
                console.log("add Sucesss");
                toast.success(`${res.data.message}`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                    style: { width: '350px' }, // Set the desired width here

                });

            }
            ).catch((err) => {
                console.log(err);
            }).finally(() => {
                setIsload(false)
            })
    }


    function addToWishlist(productId, e) {
        e.stopPropagation();
        console.log("Adding product with ID:", productId);

        axios
            .post(`${baseUrl}/api/v1/wishlist`, { productId }, {
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                console.log(res);
                setWishlist((prev) => ({
                    ...prev,
                    data: [...prev.data, { id: productId }]
                }));

                toast.success(`${res.data.message}`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                    style: { width: '350px' },
                });
                queryClient.invalidateQueries(["cart"]);


            }
            ).catch((err) => {
                console.log(err);
            })
    }


    function removeProductWishlist(productId, e) {
        e.stopPropagation();
        console.log("Removing product with ID:", productId); // Debugging

        axios.delete(`${baseUrl}/api/v1/wishlist/${productId}`, {
            headers: {
                token: localStorage.getItem("token")
            },
        }).then((res) => {
            console.log("remved succ", res);

            console.log(res);
            setWishlist((prev) => ({
                ...prev,
                data: prev.data.filter(item => item.id !== productId) // Remove product from local state
            }));
            toast.success(`${res.data.message}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
                style: { width: '370px' }, // Set the desired width here

            });

        }
        ).catch((err) => {
            console.log(err);
        })
    }





    return (
        <div>
            <div className="relative mx-auto flex w-full overflow-hidden  max-w-xs min-w-40 flex-col  group rounded-lg border-2   bg-white shadow-md  h-[90%] hover:border-black duration-700 ">
                <Link to={"/product/" + product._id} className="relative mx-3 mt-3 flex  overflow-hidden rounded-xl" >
                    <div className=" w-full overflow-hidden">
                        <img className="object-contain   w-full transform duration-300 hover:scale-105" src={product.imageCover} alt="product image" />
                    </div>
                    {/* <img className="object-cover  w-full" src={product.imageCover} alt="product image" /> */}
                    <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">18% OFF</span>

                </Link>
                <Link to={"/product/" + product._id} className="mt-4 mb-4 px-5 pb-5 ">
                    <div className='h-14' >
                        <h5 className="text-xl tracking-tight text-slate-900 line-clamp-2">{product.title}</h5>
                    </div>
                    <div className="mt-2 mb-10 flex items-center justify-between ">
                        <p>
                            <span className="text-3xl font-bold text-slate-900">${product.price}</span>
                            <span className="text-sm text-slate-900 line-through">${Math.ceil(product.price + product.price * .18)}</span>
                        </p>
                        {/* <div className="flex items-center">
                            <p className="font-medium">Rating </p>
                            <span className="mr-1 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">{product.ratingsAverage}</span>
                        </div> */}
                        <div className="flex items-center ">

                            {Array(Math.floor(product.ratingsAverage)).fill().map((_, index) => (
                                <svg
                                    key={index}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-6 text-yellow-500"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ))}
                            <span className="ml-2 text-gray-600">{product?.ratingsAverage} </span>
                        </div>
                    </div>
                </Link>

                <div className="absolute top-full left-1/2 transition-all transform -translate-x-1/2 group-hover:top-[89%] duration-300 ease-in-out w-[93%]">
                    <NextBtn
                        isLoading={isload}
                        onPress={(e) => addToCart(product._id, e)}
                        className="flex items-center justify-center rounded-md bg-slate-900 w-full py-6 text-center text-sm font-medium text-white hover:bg-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to cart
                    </NextBtn>
                </div>
                {wishlist?.data.some(wish => wish.id === product?._id) ? (
                    <button onClick={(e) => removeProductWishlist(product._id, e)} className='absolute top-2 end-2 w-11 h-11  duration-200 text-red-600 hover:text-white hover:bg-black rounded-full flex justify-center items-center '>
                        <i className="fa-solid fa-heart  text-3xl"></i>
                    </button>
                ) : <button onClick={(e) => addToWishlist(product._id, e)} className='absolute top-2 end-2 w-11 h-11 bg-black duration-200 text-white hover:text-red-600 hover:bg-transparent rounded-full flex justify-center items-center '>
                    <i className="fa-solid fa-heart  text-3xl"></i>
                </button>
                }

            </div>


        </div>
    )
}
