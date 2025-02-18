import { useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import "./App.css";
// import NavBar from "./Components/Navbar/Navbar";
import { createBrowserRouter, createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Categories from "./pages/Categories/Categories";
import Brands from "./pages/Brands/Brands";
import Cart from "./pages/Cart/Cart";
import RouteGuard from "./RouteGuard/RouteGuard";
import LoadContextProvider from "./Contexts/LoadContext";
import LogContextProvider from "./Contexts/LogContext";
import { ToastContainer } from "react-toastify";
// import Loading from "./pages/Loading/Loading";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Wishlist from "./pages/Wishlist/Wishlist";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Profile from "./pages/Profile/Profile";
import ProfileContextProvider from "./Contexts/ProfileContext";
import RouteAuthGuard from "./RouteGuard/RouteAuthGuard";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import VerfiyCode from "./pages/verfiy-code/VerfiyCode";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import Address from "./pages/Address/Address";
import UserAddresses from "./pages/UserAddresses/UserAddresses";
import UserOrders from "./pages/UserOrders/UserOrders";
import ProductsBrand from "./pages/Products/ProductsBrand";
import ProductsCategory from "./pages/Products/ProductsCategory";
import { motion } from "framer-motion";
const router = createHashRouter([{
  path: "", element: <Layout />, children: [
    { index: true, element: <RouteGuard><Home /></RouteGuard> },
    { path: "home", element: <Navigate to={"/"} /> },
    { path: "register", element: <RouteAuthGuard> <Register /> </RouteAuthGuard> },
    { path: "login", element: <RouteAuthGuard> <Login /> </RouteAuthGuard> },
    { path: "forgetPassword", element: <RouteAuthGuard> <ForgetPassword /> </RouteAuthGuard> },
    { path: "VerfiyCode", element: <RouteAuthGuard> <VerfiyCode /> </RouteAuthGuard> },
    { path: "ResetPassword", element: <RouteAuthGuard> <ResetPassword /> </RouteAuthGuard> },
    { path: "cart", element: <RouteGuard><Cart /></RouteGuard> },
    { path: "brands", element: <RouteGuard><Brands /></RouteGuard> },
    { path: "categories", element: <RouteGuard><Categories /></RouteGuard> },
    { path: "wishlist", element: <RouteGuard><Wishlist /></RouteGuard> },
    { path: "profile", element: <RouteGuard><Profile /></RouteGuard> },
    { path: "address/:cartId", element: <RouteGuard><Address /></RouteGuard> },
    { path: "userAddresses", element: <RouteGuard><UserAddresses /></RouteGuard> },
    { path: "allorders", element: <RouteGuard><UserOrders /></RouteGuard> },
    { path: "product/:id", element: <RouteGuard><ProductDetails /></RouteGuard> },
    { path: "ProductsBrand/:id", element: <RouteGuard><ProductsBrand /></RouteGuard> },
    { path: "ProductsCategory/:id", element: <RouteGuard><ProductsCategory /></RouteGuard> },
  ]
}]);

const Qcleint = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={Qcleint}>
      <ProfileContextProvider>
        <LoadContextProvider>
          <LogContextProvider>
            <NextUIProvider>
                <RouterProvider router={router} />
              <ToastContainer />
              {/* <Input className="w-1/2 m-auto" label="Email" type="email" /> */}
            </NextUIProvider>
          </LogContextProvider>
        </LoadContextProvider>
      </ProfileContextProvider>
    </QueryClientProvider>
    // <Loading/>
  );
}

export default App;
