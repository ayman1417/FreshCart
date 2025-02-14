import React, { useState } from "react";
import { baseUrl } from "../../Helper/helper.module";
import axios from "axios";
import Slider from "react-slick";
import { Pagination } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading/Loading";
import Product from "../../Components/Product/Product";
import { motion } from "framer-motion";
export default function Home() {
    const [currentPage, setCurrentPage] = useState(1);

    async function getProducts(page = 1) {
        const res = await axios.get(`${baseUrl}/api/v1/products?page=${page}`);
        return res.data;
    }

    const { data: products, error, isError, isLoading } = useQuery({
        queryKey: ["products", currentPage],
        queryFn: () => getProducts(currentPage),
        keepPreviousData: true,
        staleTime: 10000
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

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 3500,
        cssEase: "linear",

    };


    return (
        <div>
            <motion.div initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >

                <div className="w-full  mx-auto my-3">
                    <Slider {...settings} className="">
                        <div className="h-44 flex   justify-center items-center bg-gradient-to-r from-black to-zinc-800 text-white rounded-xl shadow-lg p-8 text-center">
                            <div className="flex items-center gap-4">
                                <i className="fa-solid fa-tag text-4xl sm:text-7xl"></i>
                                <h1 className="sm:text-3xl text-xl font-bold">18% Off on Every Product!</h1>
                            </div>
                        </div>
                        <div className="h-44 flex   justify-center items-center bg-gradient-to-r from-black to-zinc-800  text-white rounded-xl shadow-lg p-8 text-center">
                            <div className="flex items-center gap-4">
                                <i className="fa-solid fa-gift text-4xl sm:text-7xl"></i>
                                <h1 className="sm:text-3xl text-xl font-bold">Buy 5 Products, Get 2 FREE!</h1>
                            </div>
                        </div>
                        <div className="h-44 flex   justify-center items-center bg-gradient-to-r  from-black to-zinc-800 text-white rounded-xl shadow-lg p-8 text-center">
                            <div className="flex items-center gap-4">
                                <i className="fa-solid fa-star text-4xl sm:text-7xl"></i>
                                <h1 className="sm:text-3xl text-xl font-bold">Exclusive Deals Just for You!</h1>
                            </div>
                        </div>
                    </Slider>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
                    {products?.data.map((product, index) => (
                        <Product key={index} product={product} />
                    ))}
                </div>

                <div className="mb-5 flex justify-center">
                    <Pagination
                        page={currentPage}
                        onChange={(page) => setCurrentPage(page)}
                        total={products?.metadata.numberOfPages}
                        initialPage={1}
                        showControls
                        color="primary"
                        className="mx-auto text-center"
                    />
                </div>
            </motion.div>

        </div>
    );
}
