import React from 'react'
import { useContext } from 'react';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup"; // Correct import for Yup
import axios from "axios";
import { Input as NextInput, user } from "@nextui-org/react";
import { Button as NextBtn } from "@nextui-org/react";

export default function UpdateProfile({ formik, isLoad, emailErr }) {

    return (
        <div>
            <div className="">
                <form onSubmit={formik.handleSubmit} className=" max-w-screen-sm m-auto grid grid-cols-1 gap-5  shadow-xl border-black border-opacity-20 border-2 p-5 rounded-2xl" >
                    <h1 className="sm:text-3xl text-2xl font-bold text-center mb-6 text-gray-800">
                        Update user data
                    </h1>
                    <NextInput isInvalid={formik.touched.name && formik.errors.name} errorMessage={formik.errors.name} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.name} name="name" variant="bordered" className="col-span-2" label="Name" type="text" />
                    <NextInput className="col-span-2" isInvalid={formik.touched.email && formik.errors.email} errorMessage={formik.errors.email} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} name="email" variant="bordered" label="Email" type="email" />
                    <NextInput className="col-span-2 " isInvalid={formik.touched.phone && formik.errors.phone} errorMessage={formik.errors.phone} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.phone} name="phone" variant="bordered" label="Phone" type="tel" />
                    {emailErr && <p className="text-red-500 col-span-2">{emailErr}</p>}
                    <NextBtn loading={isLoad} type="submit" className="col-span-2 p-4 bg-black" color="primary" >Save</NextBtn>
                </form>


            </div>
        </div>
    )
}
