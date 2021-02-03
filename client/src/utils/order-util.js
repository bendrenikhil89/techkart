import axios from 'axios';

export const createOrder = async(email, authtoken, userId, paymentIntent) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/order/confirm`, {email, userId, paymentIntent}, {
        headers: {
            authtoken
        }
    });
}

export const fetchAllOrders = async(email, authtoken, purchasedBy) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/orders/all`, {email, purchasedBy}, {
        headers: {
            authtoken
        }
    });
}