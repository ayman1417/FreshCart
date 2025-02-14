import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { baseUrl } from '../../Helper/helper.module'
import Loading from '../Loading/Loading'
import { loadContext } from '../../Contexts/LoadContext'
import { Button as NextBtn } from "@nextui-org/react";
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import confetti from 'canvas-confetti';
import CartProduct from '../../Components/CartProduct/CartProduct'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion';

export default function Cart() {
    const { loading, setLoading } = useContext(loadContext)
    const [count, setCount] = useState(1);
    const [bounce, setBounce] = useState(null);
    const [timeRequestReduce, setTimeRequestReduce] = useState();
    const [timeRequestIncrease, setTimeRequestIncrease] = useState();
    const handleConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const { data: cart, error, isError, isLoading } = useQuery({
        queryKey: ["cart"],
        staleTime: 10000,

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


    function removeProductCart(productId, index) {
        setBounce(index); 
        axios.delete(`${baseUrl}/api/v1/cart/${productId}`, {
            headers: {
                token: localStorage.getItem("token")
            },
        }).then((res) => {


            toast.success(`Removed successfully`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
                style: { width: '370px' }, 

            });
        }
        ).catch((err) => {
            console.log(err);
        }).finally(() => {
            setTimeout(() => setBounce(null), 500);
        })
    }
    function icreaseQuantity(productId, count) {
        clearTimeout(timeRequestIncrease)
        setTimeRequestIncrease(setTimeout(() => {

            axios.put(`${baseUrl}/api/v1/cart/${productId}`, { count: count }, {
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                console.log(res);
            }
            ).catch((err) => {
                console.log(err);
            })
        }, 500)
        )
    }
    function reduceQuantity(productId, count) {
        clearTimeout(timeRequestReduce)
        setTimeRequestReduce(setTimeout(() => {

            axios.put(`${baseUrl}/api/v1/cart/${productId}`, { count: count }, {
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                console.log(res);
            }
            ).catch((err) => {
                console.log(err);
            })
        }, 2000)
        )
    }

    function clearCart() {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
                axios.delete(`${baseUrl}/api/v1/cart`, {
                    headers: {
                        token: localStorage.getItem("token")
                    },
                }).then((res) => {
                    console.log(res);
                    setCartId()
                }
                ).catch((err) => {
                    console.log(err);
                })
            }
        });

    }


    return (
        <motion.div initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >

            <div>
                {
                    cart?.products.length == 0 ? (
                        <div className=' m-44  flex justify-center items-center    ' >
                            <div className="grid grid-cols-2 text-center gap-1 min-w-96   rounded-lg p-10">
                                <i className="fa-solid fa-cart-shopping col-span-2  text-7xl "></i>
                                <h2 className="text-3xl col-span-2 font-semibold text-gray-700 ">Your cart is empty</h2>
                                <p className="text-lg text-gray-500 mt-2 col-span-2">
                                    Looks like you haven't added anything yet.
                                </p>

                                <NextBtn
                                    as={Link} to={"/home"}
                                    className=" col-span-2 mt-4 mx-auto p-7 px-10 w-full max-w-[280px] rounded-xl text-lg text-white flex justify-center items-center  bg-green-600" color="primary" >
                                    <p>Continue Shopping</p>
                                    <i className="fa-brands fa-shopify"></i>
                                </NextBtn>
                            </div>
                        </div>) : (
                        <div className="py-16 relative">

                            <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
                                <h2 className="title font-manrope font-bold text-4xl leading-10 mb-8 text-center text-black">Shopping Cart
                                </h2>
                                <div className="hidden lg:grid grid-cols-2 py-6">
                                    <div className="font-normal text-xl leading-8 text-gray-500">Product</div>
                                    <p className="font-normal text-xl leading-8 text-gray-500 flex items-center justify-between">
                                        <span className="w-full max-w-[260px] text-center ms-20">Quantity</span>
                                        <span className="w-full max-w-[200px] text-center ">Total</span>
                                    </p>
                                </div>

                                {
                                    cart?.products.map((cartProduct, index) => (
                                        <CartProduct index={index} key={index} cartProduct={cartProduct} reduceQuantity={reduceQuantity} icreaseQuantity={icreaseQuantity} bounce={bounce} setBounce={setBounce} removeProductCart={removeProductCart} />
                                    ))
                                }

                                <div className="bg-gray-50 rounded-xl p-6 w-full mb-8 max-lg:max-w-xl max-lg:mx-auto">
                                    <div className="flex items-center justify-between w-full mb-6">
                                        <p className="font-normal text-xl leading-8 text-gray-400">Sub Total</p>
                                        <h6 className="font-semibold text-xl leading-8 text-gray-900">${cart?.totalCartPrice}</h6>
                                    </div>
                                    <div className="flex items-center justify-between w-full pb-6 border-b border-gray-200">
                                        <p className="font-normal text-xl leading-8 text-gray-400">Delivery Charge</p>
                                        <h6 className="font-semibold text-xl leading-8 text-gray-900">$50.00</h6>
                                    </div>
                                    <div className="flex items-center justify-between w-full py-6">
                                        <p className="font-manrope font-medium text-2xl leading-9 text-gray-900">Total</p>
                                        <h6 className="font-manrope font-medium text-2xl leading-9 text-indigo-500">${cart?.totalCartPrice + 50}</h6>
                                    </div>
                                </div>
                                <div className="flex items-center flex-col sm:flex-row justify-center gap-3 mt-8">
                                    <NextBtn as={Link} to={`/address/${cart?._id}`} className="col-span-2 p-7 px-10 w-full max-w-[280px] rounded-xl text-lg text-white  bg-black" color="primary" >
                                        Checkout
                                        <i className="fa-solid fa-money-check-dollar"></i>
                                    </NextBtn>
                                    <NextBtn onPress={clearCart} className="col-span-2 p-7 px-10 w-full max-w-[280px] rounded-xl text-lg text-white " color="danger" >
                                        Cancel
                                    </NextBtn>
                                    {/* <button className="rounded-full w-full max-w-[280px] py-4 text-center justify-center items-center bg-indigo-600 font-semibold text-lg text-white flex transition-all duration-500 hover:bg-indigo-700">Continue
                                    to Payment
                                    <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width={23} height={22} viewBox="0 0 23 22" fill="none">
                                    <path d="M8.75324 5.49609L14.2535 10.9963L8.75 16.4998" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    </button> */}


                                </div>
                                {/* <button
                                        onClick={handleConfetti}
                                        
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                        Celebrate 🎉
                                        </button> */}
                            </div>
                        </div>
                    )

                }


            </div>
        </motion.div>

    )
}
