import axios from 'axios';

export const createPaymentIntent = async(email, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/create-payment-intent`, {email},{
        headers: {
            authtoken
        }
    });
}