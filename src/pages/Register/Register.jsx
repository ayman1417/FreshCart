import React, { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";
import { Button as NextBtn } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Correct import for Yup
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../Helper/helper.module";
import { motion } from 'framer-motion';

export default function Register() {
    const [emailErr, setEmailErr] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            rePassword: "",
            phone: "+20",
        },
        onSubmit: () => {
            setIsLoad(true);
            axios.post(`${baseUrl}/api/v1/auth/signup`, formik.values).then((res) => {
                console.log(res);
                navigate("/login");
            }).catch((err) => {
                setEmailErr(err.response.data.message);
            }).finally(() => {
                setIsLoad(false);
            });

            console.log(formik.values);

        }

        ,
        validationSchema: Yup.object({
            name: Yup.string().required("Name is Required").min(3, "Too short").max(50, "Too long"),
            email: Yup.string().required("Email is Required").email("Invalid email").min(8, "Too short").max(50, "Too long"),
            password: Yup.string().required("Password is Required").min(8, "Too short").max(50, "Too long"),
            rePassword: Yup.string().required("Password is Required").min(8, "Too short").max(50, "Too long").oneOf([Yup.ref("password"), null], "Passwords must match"),
            phone: Yup.string().required("Phone is Required").matches(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/, "Phone must start with +20 and contain 10 digits"),
        }),
    });
    return (
        <>
            <div className=" mt-14  ">
                <motion.div initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: .5 }}
                >
                    <form onSubmit={formik.handleSubmit} className=" max-w-screen-sm m-auto grid grid-cols-1 gap-5 mt-10 shadow-xl border-black border-opacity-20 border-2 p-5 rounded-2xl" >
                        <h1 className="sm:text-3xl text-2xl col-span-2  font-bold text-center mb-6 text-gray-800">
                            Create Your Account
                        </h1>

                        <Input isInvalid={formik.touched.name && formik.errors.name} errorMessage={formik.errors.name} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.name} name="name" variant="bordered" className="col-span-2" label="Name" type="text" />
                        <Input className="col-span-2" isInvalid={formik.touched.email && formik.errors.email} errorMessage={formik.errors.email} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} name="email" variant="bordered" label="Email" type="email" />
                        <Input className="col-span-2 md:col-span-1" isInvalid={formik.touched.password && formik.errors.password} errorMessage={formik.errors.password} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} name="password" variant="bordered" label="Password" type="password" />
                        <Input className="col-span-2 md:col-span-1" isInvalid={formik.touched.rePassword && formik.errors.rePassword} errorMessage={formik.errors.rePassword} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.rePassword} name="rePassword" variant="bordered" label="Repassword" type="password" />
                        <Input className="col-span-2 " isInvalid={formik.touched.phone && formik.errors.phone} errorMessage={formik.errors.phone} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.phone} name="phone" variant="bordered" label="Phone" type="tel" />
                        {emailErr && <p className="text-red-500 col-span-2">{emailErr}</p>}
                        <div className="flex justify-between items-center mb-2">
                            <Link to={"/login"} className="px-2 font-medium text-black hover:text-blue-800 duration-100">
                                Already have an account? Login
                            </Link>
                        </div>
                        <NextBtn isLoading={isLoad} type="submit" className="col-span-2 p-4 bg-black" color="primary" >Register</NextBtn>
                    </form>
                </motion.div>


            </div>
        </>
    );
}
