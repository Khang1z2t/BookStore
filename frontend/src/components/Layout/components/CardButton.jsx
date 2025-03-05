import {Box, IconButton} from "@mui/material";
import {Link} from "react-router-dom";
import {ShoppingCartIcon} from "lucide-react";
import React, {useEffect, useState} from "react";
import {Badge} from "antd";
import {getCart} from "~/services/CartService";

function CartButton() {
    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = async () => {
        const cartResponse = await getCart();
        const cart = cartResponse.data.items || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        setCartCount(totalItems);
    };

    useEffect(() => {
        updateCartCount().then(r => r);

        const handleStorageChange = () => {
            updateCartCount().then(r => r);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         updateCartCount().then(r => r);
    //     }, 5000);
    //
    //     return () => clearInterval(interval);
    // }, []);

    return (
        <Box className={'mr-3'}>
            <IconButton component={Link} to="/cart" color="inherit">
                <Badge count={cartCount} overflowCount={99}>
                    <ShoppingCartIcon className={'text-white'} size={24}/>
                </Badge>
            </IconButton>
        </Box>
    )
}

export default CartButton;