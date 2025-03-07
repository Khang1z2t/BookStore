import {Box, IconButton} from "@mui/material";
import {Link} from "react-router-dom";
import {ShoppingCartIcon} from "lucide-react";
import React, {useEffect, useState} from "react";
import {Badge} from "antd";
import {getCart} from "~/services/CartService";
import {useCart} from "~/context/CartContext";

function CartButton() {
    const {cartCount} = useCart();

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