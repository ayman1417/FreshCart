import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { baseUrl } from '../../Helper/helper.module';
import { loadContext } from "../../Contexts/LoadContext";
import Loading from '../Loading/Loading';
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
export default function Categories() {
    const { loading, setLoading } = useContext(loadContext);

    async function getCategory() {
        const res = await axios.get(`${baseUrl}/api/v1/categories`);
        return res.data.data;
    }


    const { data: categorys, error, isError, isLoading } = useQuery({
        queryKey: ["Categorys"],
        queryFn: getCategory,
        staleTime: 10000
    })



    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <div className=" text-5xl text-red-500">
            <p> {error.message}</p>
        </div>
    }


    return (

        <div className='mt-14 mb-10'>
            <motion.div initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

                    {
                        categorys?.map((category, index) => (
                            <div key={index} className="">

                                <Link to={"/ProductsCategory/" + category._id} className="border-2 rounded-lg p-5 text-center flex justify-center hover:shadow-2xl hover:border-black hover:border-opacity-30 duration-200 items-center flex-col ">
                                    <div className="w-100">
                                        <img className='w-100 ' src={category.image} alt="" />
                                    </div>
                                    <h1 className='text-center'>{category.name}</h1>
                                </Link>
                            </div>
                        ))

                    }
                </div>
            </motion.div>

        </div>
    )
}
