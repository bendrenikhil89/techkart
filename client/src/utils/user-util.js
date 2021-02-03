import axios from 'axios';

export const saveCart = async(email, authtoken, cart) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/user/cart`, {email, cart}, {
        headers: {
            authtoken
        }
    });
}

export const getCart = async(email, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/user/getcart`, {email}, {
        headers: {
            authtoken
        }
    });
}

export const addAddress = async(email, authtoken, address) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/user/address`, {email, address}, {
        headers: {
            authtoken
        }
    });
}

export const updatePassword = async(email, authtoken, password, newPassword) => {
    return await axios.put(`${process.env.REACT_APP_API_URL}/user/updatepassword`, {email, password, newPassword}, {
        headers: {
            authtoken
        }
    });
}

export const addWishlist = async(email, authtoken, productID) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/user/addwishlist`, {email, productID}, {
        headers: {
            authtoken
        }
    });
}

export const getWishlist = async(email, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/user/wishlist`, {email}, {
        headers: {
            authtoken
        }
    });
}

export const removeWishlist = async(email, authtoken, productID) => {
    return await axios.delete(`${process.env.REACT_APP_API_URL}/user/removewishlist`, {email, productID}, {
        headers: {
            authtoken
        }
    });
}