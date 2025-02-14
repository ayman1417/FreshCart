import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { loadContext } from "../../Contexts/LoadContext";
import { useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../Helper/helper.module';
import Slider from "react-slick";
import Product from '../../Components/Product/Product';
import ReltedProduct from '../../Components/ReltedProduct/ReltedProduct';

import { Bounce, toast } from 'react-toastify'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Loading from '../Loading/Loading';
import { motion } from 'framer-motion';

export default function ProductDetails() {
    const { loading, setLoading } = useContext(loadContext);

    const [mainImage, setMainImage] = useState('');
    const [rate, setRate] = useState();
    const { id } = useParams();
    const queryClient = useQueryClient();


    const navigate = useNavigate();
    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <button
                className={`${className} custom-arrow next-arrow`}
                style={{
                    ...style,
                    background: "linear-gradient(45deg, #4f46e5, #6b5ce7)",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    transform: "scale(1)",
                    transition: "transform 0.2s ease",
                }}
                onClick={onClick}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    stroke="none"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <button
                className={`${className} custom-arrow prev-arrow`}
                style={{
                    ...style,
                    background: "linear-gradient(45deg, #4f46e5, #6b5ce7)",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    transform: "scale(1)",
                    transition: "transform 0.2s ease",
                }}
                onClick={onClick}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    stroke="none"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>
        );
    }

    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 3,
        speed: 700,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };



    async function fetchProduct() {
        const res = await axios.get(`${baseUrl}/api/v1/products/${id}`);
        setMainImage(res.data.data.imageCover);
        
        setRate(res.data.data.ratingsAverage)
        return res.data.data;
    };

    async function fetchRelatedProducts(categoryId) {
        const res = await axios.get(`${baseUrl}/api/v1/products?category=${categoryId}`);
        return res.data.data;
    };





    const { data: productDetails, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: fetchProduct,
        onSuccess: (data) => {
            setMainImage(data.imageCover);
            queryClient.prefetchQuery({ queryKey: ['relatedProducts', data.category._id], queryFn: () => fetchRelatedProducts(data.category._id) });
        },
    });

    const { data: relatedProducts } = useQuery({
        queryKey: ['relatedProducts', productDetails?.category?._id],
        queryFn: () => fetchRelatedProducts(productDetails.category._id),
        enabled: !!productDetails?.category?._id,
    });


    function changeImage(src) {
        setMainImage(src);
    }

    console.log(rate);
    
    function addToCart(productId) {
        console.log("Adding product with ID:", productId); // Debugging

        axios
            .post(`${baseUrl}/api/v1/cart`, { productId }, {
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                console.log(res);

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
            })
    }


    function addToWishlist(productId) {
        console.log("Adding product with ID:", productId); // Debugging

        axios
            .post(`${baseUrl}/api/v1/wishlist`, { productId }, {
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                console.log(res);
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

                queryClient.invalidateQueries(["cart"]);

            }
            ).catch((err) => {
                console.log(err);
            })
    }



    if (isLoading) return <Loading />;


    return (
        <div>
            <motion.div initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >

                <div className="">
                    <div className="">
                        <div className="container mx-auto px-4 py-8">
                            <div className="flex flex-wrap -mx-4">
                                <div className="w-full md:w-1/2 px-4 mb-8 ">
                                    <img src={mainImage} alt="Product" className=" w-full lg:w-[55%] mx-auto  object-contain rounded-lg shadow-md mb-4" id="mainImage" />
                                    <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                                        {
                                            productDetails?.images.map((img, index) => (
                                                <img key={index} onClick={() => changeImage(img)} src={img} alt="Thumbnail 1" className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300" />
                                            ))

                                        }
                                    </div>
                                </div>
                                {/* Product Details */}
                                <div className="w-full md:w-1/2 px-4 md:my-auto  ">
                                    <h2 className="text-3xl font-bold mb-2">{productDetails?.title}</h2>
                                    <div className="mb-4">
                                        <span className="text-2xl font-bold mr-2">${productDetails?.price}</span>
                                        <span className="text-gray-500 line-through">${Math.ceil(productDetails?.price + productDetails?.price * .18)}</span>
                                    </div>
                                    <div className="flex items-center mb-4">

                                    {Array(Math.floor(rate)).fill().map((_, index) => (
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
                                        <span className="ml-2 text-gray-600">{productDetails?.ratingsAverage} ({productDetails?.ratingsQuantity} reviews)</span>
                                    </div>
                                    <p className="text-gray-700 mb-6">{productDetails?.description}.</p>

                                    <div className="flex space-x-4 mb-6">
                                        <button onClick={() => addToCart(productDetails?.id)} className="hover:bg-gray-800  bg-slate-900 flex gap-2 items-center duration-200 text-white px-7 py-3 rounded-md  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                            </svg>
                                            Add to Cart
                                        </button>
                                        <button onClick={() => addToWishlist(productDetails?.id)} className="bg-red-500  hover:border-red-600  shadow-xl hover:bg-red-600 flex gap-2 items-center  text-white px-7 py-3 rounded-md duration-200  ">
                                            <i className="fa-solid fa-hand-holding-heart"></i>
                                            Wishlist
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ReltedProduct reltedProduct={relatedProducts} />
                </div>
            </motion.div>


        </div>
    )
}
