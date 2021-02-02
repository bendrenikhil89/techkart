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