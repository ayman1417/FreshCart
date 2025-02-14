import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { baseUrl } from '../../Helper/helper.module'
import Loading from '../Loading/Loading'
import { loadContext } from '../../Contexts/LoadContext'
import Swal from 'sweetalert2';
import { Button as NextBtn } from "@nextui-org/react";
import { Bounce, toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'

import { motion } from 'framer-motion'


export default function Wishlist() {
    const { loading, setLoading } = useContext(loadContext)
    const [isload , setIsload] = useState(); 

    async function getWishlistUser() {
        const res = await axios.get(`${baseUrl}/api/v1/wishlist`, {
            headers: {
                token: localStorage.getItem("token")
            },
        })
        return res.data;
    }

    const { data: wishlist, error, isError, isLoading } = useQuery({
        queryKey: ["wishlist"],
        queryFn: getWishlistUser,
        refetchInterval: 1000
    });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return (
            <div className="text-center text-5xl text-red-500">
                <p>Error fetching products: {error.message}</p>
            </div>
        );
    }


    function updateWishlistUser() {
        axios.get(`${baseUrl}/api/v1/wishlist`, {
            headers: {
                token: localStorage.getItem("token")
            },
        }).then((res) => {
            console.log(res);
        }
        ).catch((err) => {
            console.log(err);
        })
    }


    function addToCart(productId) {
        console.log("Adding product with ID:", productId);
        setIsload(true);
        axios
            .post(`${baseUrl}/api/v1/cart`, { productId }, {
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                console.log(res);
                removeProductWishlist(productId);
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

            }
            ).catch((err) => {
                console.log(err);
            }).finally(()=>{
                setIsload(false)
            })
    }

    function removeProductWishlist(productId) {
        axios.delete(`${baseUrl}/api/v1/wishlist/${productId}`, {
            headers: {
                token: localStorage.getItem("token")
            },
        }).then((res) => {
            console.log("remved succ");

            console.log(res);
            updateWishlistUser()
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
            {loading ? (<Loading />) : (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className='container ' >
                <div className="font-sans max-w-5xl max-md:max-w-xl mx-auto bg-white py-4 lg:w-[58%]">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">Wish List</h1>
                    <div className="grid md:grid-cols-3 gap-8 mt-8">
                        <h1 className='text-2xl font-bold text-gray-800'>Product :{wishlist?.count} </h1>
                        <div className="md:col-span-3 space-y-4">
                            {
                                wishlist?.data.map((wishProduct, index) => (
                                    <div className="">

                                        <div key={index} className="grid grid-cols-3 items-start gap-4 relative">
                                            <div className="  col-span-2 flex items-start gap-4">
                                                <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0  p-2 rounded-md">
                                                    <img src={wishProduct?.imageCover} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="text-base font-bold p-2 text-gray-800">{wishProduct?.title}</h3>
                                                    <button onClick={() => removeProductWishlist(wishProduct?._id)} type="button" className="mt-6 font-semibold text-red-500 hover:text-red-700 duration-150  text-sm flex items-center gap-1 shrink-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 fill-current inline" viewBox="0 0 24 24">
                                                            <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" data-original="#000000" />
                                                            <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" data-original="#000000" />
                                                        </svg>
                                                        REMOVE
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="ml-auto ">
                                                <h4 className="text-lg max-sm:text-base font-bold me-12 text-gray-800">${wishProduct?.price}</h4>
                                            </div>
                                            <NextBtn isLoading={isload} onPress={() => addToCart(wishProduct?._id)} className=" absolute bottom-3 end-2 transform   flex items-center justify-center rounded-md bg-slate-900  px-4  py-4 text-center text-sm font-medium text-white hover:bg-gray-800  ">
                                                <svg xmlns="http://www.w3.org/2000/svg" className=" h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Add  to cart
                                            </NextBtn>
                                        </div>
                                        <hr className="border-gray-300" />
                                    </div>

                                ))}

                        </div>

                    </div>
                </div>
                </motion.div>

            )

            }

        </div>
    )
}
