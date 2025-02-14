import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import Loading from '../Loading/Loading';
import { useParams } from 'react-router-dom';
import { baseUrl } from '../../Helper/helper.module';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";

import { Button as NextBtn } from '@nextui-org/react';
import { motion } from "framer-motion";

import { useState } from 'react';
export default function UserOrders() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedOrder, setSelectedOrder] = useState();

    const { cartId } = useParams()
    async function getOreders() {
        const res = await axios.get(`${baseUrl}/api/v1/orders/user/${localStorage.getItem("userId")}`, {

        });
        return res.data.reverse(); 
    }

    function modelOrder(order) {
        setSelectedOrder(order);
        onOpen();
    }


    const { data: orders, error, isError, isLoading } = useQuery({
        queryKey: ["oreders"],
        queryFn: () => getOreders(),
        staleTime: 10000,

    });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return (
            <div className=" mt-10 text-center text-5xl text-red-500">
                <p>Error fetching products: {error.message}</p>
            </div>
        );
    }


    return (
        <motion.div initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >

            <div className="">
                <h1 className="text-3xl font-bold text-center my-10 ">User Orders</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-10">

                    {
                        orders?.map((order, index) => (
                            <div
                                onClick={() => modelOrder(order)}
                                key={index}
                                className=" cursor-pointer relative  bg-gray-50 text-black border-2 border-black border-opacity-20 hover:border-opacity-50    p-6 rounded-2xl shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-2xl"
                            >

                                <p className="">
                                    <strong>Created At:</strong> {new Date(order?.createdAt).toLocaleString()}
                                </p>
                                <p className="">
                                    <strong>Payment Method:</strong> {order?.paymentMethodType}
                                </p>
                                <p className="">
                                    <strong>Number of Items:</strong> {order?.cartItems.length}
                                </p>
                                <p className="">
                                    <strong>Total Price:</strong> ${order?.totalOrderPrice}
                                </p>
                            </div>
                        ))
                    }
                </div>
                <Modal isOpen={isOpen} scrollBehavior="inside" onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 font-semibold text-2xl">Order Details</ModalHeader>
                                <ModalBody>
                                    <p className="text-lg">
                                        <strong>Created At:</strong> {new Date(selectedOrder?.createdAt).toLocaleString()}
                                    </p>
                                    <p className="">
                                        <strong>Payment Method:</strong> {selectedOrder?.paymentMethodType}
                                    </p>
                                    <p className="">
                                        <strong>shipping Address:</strong> {selectedOrder?.shippingAddress.city} , {selectedOrder?.shippingAddress.details}
                                    </p>

                                    <p className="">
                                        <strong>Phone:</strong> {selectedOrder?.shippingAddress.phone}
                                    </p>

                                    <p className="">
                                        <strong>Number of Items:</strong> {selectedOrder?.cartItems.length}
                                    </p>
                                    <ul className="list-disc pl-5">
                                        {
                                            selectedOrder?.cartItems.map((cartItem, index) => (
                                                <li className="">
                                                    <strong>Product Name:</strong> {cartItem?.product.title}
                                                </li>

                                            ))
                                        }
                                    </ul>

                                    <p className="text-lg">
                                        <strong>Total Price:</strong> ${selectedOrder?.totalOrderPrice}
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <NextBtn color="danger" onPress={onClose}>
                                        Close
                                    </NextBtn>

                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

            </div>
        </motion.div>

    );

}
