import React, { useState, useEffect } from "react";
import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { Button as NextBtn } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Correct import for Yup
import axios from "axios";
import { p, u, use } from "framer-motion/m";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../Helper/helper.module";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading/Loading";
import { motion } from "framer-motion";
import confetti from 'canvas-confetti';

export default function Address() {
    const [emailErr, setEmailErr] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const [isCash, setIsCash] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");
    const handleConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const { cartId } = useParams()
    const navigate = useNavigate();

    console.log("cartId : ", cartId);
    async function getAdresses() {
        const res = await axios.get(`${baseUrl}/api/v1/addresses`, {
            headers: {
                token: localStorage.getItem("token"),
            },
        });
        console.log(res.data.data);
        return res.data.data;
    }


    const { data: addresses, error, isError, isLoading } = useQuery({
        queryKey: ["addresses"],
        queryFn: () => getAdresses(),
        staleTime: 10000
    });

    function cashPay() {
        setIsLoad(true);
        axios.post(`${baseUrl}/api/v1/orders/${cartId}`, {
            "shippingAddress": {
                "details": formik.values.details,
                "phone": formik.values.phone,
                "city": formik.values.city
            }
        }, {
            headers:
            {
                token: localStorage.getItem("token")
            }
        },
        ).then((res) => {
            handleConfetti()
            console.log(res);
            addNewAdddress();
            navigate(`/allorders`)
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setIsLoad(false);
        });

        console.log("formik.values : ", formik.values);
        setIsLoad(false);
        console.log("Cash Pay");

    }
    function onlinePay() {
        setIsLoad(true);
        axios.post(`${baseUrl}/api/v1/orders/checkout-session/${cartId}`, {
            "shippingAddress": {
                "details": formik.values.details,
                "phone": formik.values.phone,
                "city": formik.values.city
            }
        }, {
            headers:
            {
                token: localStorage.getItem("token")
            },
            params:
            {
                url: "https://fresh-cart-two-pink.vercel.app/#"
            }
        }
            ,
        ).then((res) => {
            addNewAdddress()
            location.href = res.data.session.url;
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setIsLoad(false);
        });



        console.log("formik.values : ", formik.values);
        setIsLoad(false);
        console.log("online Pay");


    }


    function addNewAdddress() {
        axios.post(`${baseUrl}/api/v1/addresses`, {
            name: "Home",
            details: formik.values.details,
            phone: formik.values.phone,
            city: formik.values.city
        }, {
            headers: {
                token: localStorage.getItem("token"),
            },
        }).then((res) => {
            console.log(res);
            console.log("add sucess", res);

        }).catch((err) => {
            console.log(err.response.data.message);
        })



    }



    const formik = useFormik({
        initialValues: {
            details: "",
            city: "",
            phone: "+20",
        },
        onSubmit: () => {
            isCash ? cashPay() : onlinePay()
        },
        validationSchema: Yup.object({
            details: Yup.string().required("Details is Required"),
            city: Yup.string().required("City is Required"),
            phone: Yup.string().required("Phone is Required").matches(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/, "Phone must start with +20 and contain 10 digits"),
        }),
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
        <>
            <motion.div initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: .5 }}
            >

                <div className=" mt-14  ">
                    <form onSubmit={formik.handleSubmit} className=" max-w-screen-sm m-auto grid grid-cols-2 gap-5 mt-10 shadow-xl border-black border-opacity-20 border-2 p-5 rounded-2xl" >
                        <h1 className="sm:text-3xl text-2xl col-span-2  font-bold text-center mb-6 text-gray-800">
                            Create Your Order
                        </h1>

                        <Textarea isInvalid={formik.touched.details && formik.errors.details} errorMessage={formik.errors.details} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.details} name="details" variant="bordered" className="col-span-2" label="Details" type="text" />
                        <Input className="col-span-2" isInvalid={formik.touched.city && formik.errors.city} errorMessage={formik.errors.city} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.city} name="city" variant="bordered" label="City" type="text" />
                        <Input className="col-span-2 " isInvalid={formik.touched.phone && formik.errors.phone} errorMessage={formik.errors.phone} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.phone} name="phone" variant="bordered" label="Phone" type="tel" />
                        {/* {addresses.length > 0 && <p className="text-black ps-3 col-span-2">You Already Have Addresses Select One</p>}
                        <Select
                            label="Select Address"
                            className="col-span-2"
                            value={selectedAddress}
                            // onValueChange={handleAddressSelect}
                            onSelect={handleAddressSelect}
                        >
                            {addresses?.map((address, index) => (
                                <SelectItem key={index} value={`${address.city}, ${address.details}`}>
                                    {`${address.city}, ${address.details}`}
                                </SelectItem>
                            ))}
                        </Select> */}

                        {/* </Select> */}
                        <NextBtn isLoading={isLoad} type="submit" onPress={() => setIsCash(true)} className="col-span-2 sm:col-span-1 p-4 bg-black hover:bg-green-700 duration-100 flex justify-center items-center" color="primary" > <i className="fa-solid fa-handshake text-base"></i>  Cash</NextBtn>
                        <NextBtn isLoading={isLoad} type="submit" onPress={() => setIsCash(false)} className="col-span-2 sm:col-span-1 p-4 bg-black hover:bg-green-700 duration-100 flex justify-center items-center" color="primary" > <i className="fa-brands fa-cc-visa text-base"></i> Online Payment</NextBtn>
                    </form>

                    {/* <Select
                    className="col-span-2 text-black"
                    label="Select an Address"
                    onChange={formik.handleChange}
                >
                    <SelectItem key={1} value="a">a</SelectItem>
                    <SelectItem key={2} value="b">b</SelectItem>
                    <SelectItem key={3} value="c">c</SelectItem>
                    <SelectItem key={4} value="x">No addresses available</SelectItem>

                </Select> */}

                </div >
            </motion.div>

        </>
    );
}
