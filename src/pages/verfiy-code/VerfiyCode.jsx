import React, { useState, useEffect, useContext } from "react";
import { Input as NextInput } from "@nextui-org/react";
import { Button as NextBtn } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Correct import for Yup
import axios from "axios";
import { baseUrl } from "../../Helper/helper.module";
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

export default function VerfiyCode() {
    const navigate = useNavigate();
    const [isLoad, setIsLoad] = useState(false);


    const formik = useFormik({
        initialValues: {
            resetCode: "",
        },
        onSubmit: () => {
            setIsLoad(true);
            axios.post(`${baseUrl}/api/v1/auth/verifyResetCode`, formik.values).then((res) => {
                navigate("/ResetPassword")
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setIsLoad(false);
            });
            console.log(formik.values);
        }

        ,
        validationSchema: Yup.object({
            resetCode: Yup.string().required("ResetCode is Required").min(6, "Too short").max(6, "Too long").matches(/^\d{6}$/, "Must contain only numbers"),
        }),

    });
    return (
        <>
            <div className=" mt-14  container ">
                <motion.div initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: .5 }}
                >
                    <form onSubmit={formik.handleSubmit} className=" max-w-screen-sm m-auto grid grid-cols-1 gap-5 mt-10 shadow-xl border-black border-opacity-20 border-2 p-5 rounded-2xl" >
                        <h1 className="text-3xl font-bold text-center  text-black">
                            Enter Verification Code
                        </h1>

                        <NextInput className=" " isInvalid={formik.touched.resetCode && formik.errors.resetCode} errorMessage={formik.errors.resetCode} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.resetCode} name="resetCode" variant="bordered" label="resetCode" type="text" />
                        <NextBtn isLoading={isLoad} type="submit" className=" p-4 duration-100  bg-black  hover:bg-green-600" color="primary" >  Verify Code
                        </NextBtn>
                    </form>
                </motion.div>

            </div>
        </>
    );
}
