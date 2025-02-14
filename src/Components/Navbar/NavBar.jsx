import React, { useContext } from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Button, Tooltip,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
    button, Badge
} from "@nextui-org/react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { logContext } from "../../Contexts/LogContext";
import { useNavigate } from "react-router-dom";
import { profileContext } from "../../Contexts/ProfileContext";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../pages/Loading/Loading";
import axios from "axios";
import { baseUrl } from "../../Helper/helper.module";
export const AcmeLogo = () => {
    return (
        <div className="me-2">
            <i className="fa-solid fa-cart-shopping text-lg"></i>
        </div>
    );
};
export default function NavBar() {



    const navigate = useNavigate();
    const { isLog, setIsLog } = useContext(logContext);
    const { isProfile, setIsProfile } = useContext(profileContext);
    const { userName, setUserName } = useContext(profileContext);
    const { userEmail, setUserEmail } = useContext(profileContext);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuItems = [
        "Home",
        "Categories",
        "Brands",
        "Cart",
        "wishlist",
    ];
    function logout() {
        navigate("/login");
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        setIsLog(false);
    }
    function IconClick() {
        if (isLog) {
            navigate("/");
        }
        else {
            navigate("/login");
            setIsLog(false);
        }
    }

    function ProfileData() {
        setIsProfile(true)
        navigate("/profile");
    }
    function ProfilePassword() {
        setIsProfile(false)
        navigate("/profile");
    }

    const { data: cart, error, isError, isLoading } = useQuery({
        queryKey: ["cart"], // Uses the same queryKey
        staleTime: 10000, // Uses cached data before refetching
        refetchInterval: 1000,
    });



    return (
        <Navbar shouldHideOnScroll className="bg-black text-white" onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <button onClick={IconClick}>
                    <NavbarBrand  >
                        <AcmeLogo />
                        <p className="font-bold text-inherit ">FreshCart</p>
                    </NavbarBrand>
                </button>
            </NavbarContent>

            {isLog &&
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem>
                        <NavLink color="foreground" to="/">
                            Home
                        </NavLink>
                    </NavbarItem>

                    <NavbarItem>
                        <NavLink color="foreground" to="/categories">
                            Categories
                        </NavLink>
                    </NavbarItem>
                    <NavbarItem>
                        <NavLink color="foreground" to="/brands">
                            Brands
                        </NavLink>
                    </NavbarItem>
                    <NavbarItem >
                        <NavLink aria-current="page" to="/cart">
                            Cart
                        </NavLink>
                    </NavbarItem>

                    <NavbarItem >
                        <Tooltip content="Wish list">
                            <NavLink to={"/wishlist"} className="" >
                                <i className="fa-solid fa-hand-holding-heart text-2xl text-white"></i>
                            </NavLink>
                        </Tooltip>
                    </NavbarItem>


                </NavbarContent>
            }

            <NavbarContent justify="end">
                <NavbarItem className=" flex items-center ">
                    {isLog ? (
                        <div className="">

                            <i className="fa-solid fa-cart-shopping text-2xl ml-2 relative">
                                {cart?.products.length > 0 &&
                                    <p className=" absolute bottom-[15px] text-[10px] start-4 z-50 text-white bg-green-500 w-4 h-4 flex justify-center items-center text-center rounded-md">{cart?.products.length} </p>
                                }
                            </i>
                            <Button onPress={logout} color="danger" variant="ghost" className="mx-4">
                                Logout
                            </Button>
                            <Dropdown>
                                <DropdownTrigger>
                                    <button className="">
                                        <Tooltip content="User Profile" placement="bottom">
                                            <span className=" w-9 h-9 flex border-2 rounded-full justify-center items-center  hover:bg-white hover:text-black duration-150 ">
                                                <i className="fa-regular fa-user text-xl cursor-pointer"></i>
                                            </span>
                                        </Tooltip>
                                    </button>
                                </DropdownTrigger>

                                <DropdownMenu disabledKeys={["profile"]} aria-label="Static Actions">
                                    <DropdownItem textValue={`${userName}, ${userEmail}`} key="profile" className="h-14 gap-2 text-black">
                                        <p className="font-semibold">{userName}</p>
                                        <p className="font-semibold">{userEmail}</p>
                                    </DropdownItem>
                                    <DropdownItem textValue="Edit Profile" key="edit"><button onClick={ProfileData}>Update Profile</button></DropdownItem>
                                    <DropdownItem textValue="Change Password" key="new"><button onClick={ProfilePassword}>Change Password</button></DropdownItem>
                                    <DropdownItem textValue="Adresses" key="Adress"><Link to={"/userAddresses"} >Addresses</Link></DropdownItem>
                                    <DropdownItem textValue="Order" key="Order"><Link to={"/allorders"} >Order History</Link></DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    ) :
                        (
                            <Button as={Link} to={"/login"} color="primary" variant="ghost">
                                Login
                            </Button>
                        )
                    }
                </NavbarItem>
                <NavbarItem>
                    {!isLog &&
                        <Button as={Link} color="primary" to={"/Register"} variant="ghost">
                            Sign Up
                        </Button>
                    }
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className="w-full"
                            color={
                                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                            }
                            to={`/${item}`}
                            size="lg"
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
