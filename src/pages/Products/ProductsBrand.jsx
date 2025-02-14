import React, { useContext } from 'react'
import Loading from '../Loading/Loading'
import { baseUrl } from '../../Helper/helper.module';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { loadContext } from '../../Contexts/LoadContext';
import { useParams } from 'react-router-dom';
import Product from '../../Components/Product/Product';
import empty from "../../assets/empty.png"
import { motion } from 'framer-motion';
export default function ProductsBrand() {


    const { loading, setLoading } = useContext(loadContext);
    const { id } = useParams();



    async function getProducts(id) {
        const res = await axios.get(`${baseUrl}/api/v1/products?brand=${id}`)
        return res.data.data; 
    }


    const { data: products, error, isError, isLoading } = useQuery({
        queryKey: ["productCategory", id], 
        queryFn: () => getProducts(id),
        staleTime: 10000
    });


    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <div className=" text-5xl text-red-500">
            <p> {error.message}</p>
        </div>
    }


    return (
        <div className='mt-10'>
            <motion.div initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >

                <h1 className=' text-center text-5xl font-bold mb-10'>{products[0]?.brand.name}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
                    {products.length > 0 &&
                        products?.map((product, index) => (
                            <Product key={index} product={product} />
                        ))
                    }
                </div>
                {products.length == 0 &&
                    <div className="flex flex-col items-center justify-center m-auto text-center py-10">
                        <img
                            src={empty}
                            alt="No Products"
                            className="w-44 h-44 mb-4 opacity-75"
                        />
                        <h1 className="text-3xl font-semibold text-gray-700">No Products Found</h1>
                        <p className="text-gray-500 mt-2">Try checking another brand or category.</p>
                    </div>
                }
            </motion.div>
        </div>
    )
}
