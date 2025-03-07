import {createContext, useContext, useEffect, useState} from "react";
import {getCart} from "~/services/CartService";

const CartContext = createContext();

const CartProvider = ({children}) => {
    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = async () => {
        const cartResponse = await getCart();
        const cart = cartResponse?.data?.items || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        setCartCount(totalItems);
    }

    useEffect(() => {
        updateCartCount().then(r => r);
    }, []);

    return (
        <CartContext.Provider value={{cartCount, updateCartCount}}>
            {children}
        </CartContext.Provider>
    )
}

const useCart = () => useContext(CartContext)

export {
    CartProvider,
    useCart
}