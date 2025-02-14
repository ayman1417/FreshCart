import React from 'react'
// import NavBar from '../Components/Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import NavBar from '../Components/Navbar/NavBar'
import { motion } from 'framer-motion'
export default function Layout() {
    return (
        <>

            <NavBar />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.3 }}
                className='container ' >
                <Outlet></Outlet>
            </motion.div>
        </>
    )
}
