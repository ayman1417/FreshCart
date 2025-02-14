import React, { useState, useEffect } from "react";
import { Input,Textarea } from "@nextui-org/react";
import { Button as NextBtn } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Correct import for Yup
import axios from "axios";
import { p, u, use } from "framer-motion/m";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../Helper/helper.module";
import { Bounce, toast } from 'react-toastify'

export default function NewAddress() {
    const [emailErr, setEmailErr] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            details: "",
            city: "",
            phone: "+20",
        },
        onSubmit: () => {
            setIsLoad(true);
            axios.post(`${baseUrl}/api/v1/addresses`,formik.values,{
                headers: {
                    token: localStorage.getItem("token"),
                },
            }).then((res)=>{
                console.log(res);
                toast.success(` Added Successfully`, {
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
                
            }).catch((err) => {
                console.log(err.response.data.message);
                toast.error(`Add Faild`, {
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
            }).finally(() => {
                formik.resetForm();
                setIsLoad(false);
            });

            setIsLoad(false);

        }

        ,
        validationSchema: Yup.object({
            name: Yup.string().required("Home is Required"),
            details: Yup.string().required("Details is Required"),
            city: Yup.string().required("City is Required"),
            phone: Yup.string().required("Phone is Required").matches(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/, "Phone must start with +20 and contain 10 digits"),
        }),
    });
    return (
        <>
            <div className="  ">
                <form onSubmit={formik.handleSubmit} className="  grid grid-cols-2 gap-5  p-5 rounded-2xl" >

                    <Input isInvalid={formik.touched.name && formik.errors.name} errorMessage={formik.errors.name} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.name} name="name" variant="bordered" className="col-span-2" label="Home" type="text" />
                    <Textarea isInvalid={formik.touched.details && formik.errors.details} errorMessage={formik.errors.details} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.details} name="details" variant="bordered" className="col-span-2" label="Details" type="text" />
                    <Input className="col-span-2" isInvalid={formik.touched.city && formik.errors.city} errorMessage={formik.errors.city} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.city} name="city" variant="bordered" label="City" type="text" />
                    <Input className="col-span-2 " isInvalid={formik.touched.phone && formik.errors.phone} errorMessage={formik.errors.phone} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.phone} name="phone" variant="bordered" label="Phone" type="tel" />

                    <NextBtn isLoading={isLoad} type="submit" className="col-span-2  p-4 bg-black duration-100 flex justify-center items-center font-medium text-xl" color="primary" >Add</NextBtn>
                </form>


            </div>
        </>
    );
}
