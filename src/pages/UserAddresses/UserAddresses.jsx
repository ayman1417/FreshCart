import React, { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";
import { Button as NextBtn } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Correct import for Yup
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../Helper/helper.module";
import Loading from "../Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import {
    Modal,
    ModalContent,
    ModalHeader,
    Textarea,
    useDisclosure,
} from "@nextui-org/react";
import NewAddress from "../../Components/NewAddress/NewAddress";
import Swal from 'sweetalert2';
import { motion } from "framer-motion";


export default function UserAddresses() {
    const [isLoad, setIsLoad] = useState(false);
    const navigate = useNavigate();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();


    async function getAdresses() {
        const res = await axios.get(`${baseUrl}/api/v1/addresses`, {
            headers: {
                token: localStorage.getItem("token"),
            },
        });
        return res.data.data; // Ensure only the data is returned
    }


    const { data: addresses, error, isError, isLoading } = useQuery({
        queryKey: ["addresses"],
        queryFn: () => getAdresses(),
        refetchInterval: 1000,
        staleTime: 10000
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

    function removeAddress(addressId) {
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
                axios.delete(`${baseUrl}/api/v1/addresses/${addressId}`, {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }).then((res) => {
                    console.log(res);

                }).catch((err) => {
                    console.log(err);

                });

            }
        });


    }





    return (
        <>
            <div className="mt-14">
                <motion.div initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                >

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                        {addresses?.length == 0 ? (
                            <div className="col-span-3 text-center gap-1 min-w-96   rounded-lg p-10">
                                <i class="fa-solid fa-house-chimney  text-7xl "></i>
                                <h2 className="text-3xl col-span-2 font-semibold text-gray-700 ">Your adresses is empty</h2>
                                <p className="text-lg text-gray-500 mt-2 col-span-2">
                                    Looks like you haven't added address yet.
                                </p>

                                <NextBtn
                                    color="primary"
                                    onPress={onOpen}
                                    className="bg-black text-white  p-8 mt-5  rounded-xl hover:bg-zinc-800 transition-all text-xl"
                                >
                                    <i className="fa-solid fa-plus mr-2"></i> New Address
                                </NextBtn>

                            </div>
                        )
                            :
                            (
                                addresses?.map((address, index) => (
                                    <div
                                        key={index}
                                        className=" relative bg-zinc-900 text-white p-6 rounded-2xl shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-2xl"
                                    >
                                        <p className="text-xl font-semibold mb-2">{address?.name}</p>
                                        <p className="text-lg text-gray-200">{address?.city}</p>
                                        <p className="text-sm text-gray-300 line-clamp-2">{address?.details}</p>
                                        <button onClick={() => removeAddress(address?._id)} className=" absolute top-3 end-3 flex justify-center items-center bg-transparent hover:bg-zinc-700 rounded-full w-7 h-7 duration-300"><i className=" text-xl fa-solid fa-xmark"></i></button>
                                    </div>
                                ))
                            )}

                        {!addresses?.length == 0 &&
                            <div className="flex justify-center md:justify-start items-center h-full">
                                <NextBtn
                                    color="primary"
                                    onPress={onOpen}
                                    className="bg-black text-white h-full p-8  rounded-xl hover:bg-zinc-800 transition-all text-xl"
                                >
                                    <i className="fa-solid fa-plus mr-2"></i> New Address
                                </NextBtn>
                            </div>
                        }

                    </div>




                    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} backdrop="blur">
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex justify-center items-center gap-x-2 text-2xl font-bold">
                                        <i className="fa-solid fa-house-chimney"></i> Add Address
                                    </ModalHeader>
                                    <NewAddress />
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </motion.div>
            </div>
        </>
    );
}
