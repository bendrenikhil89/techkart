import axios from 'axios';

export const login = async(email, password) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/login`, {email, password}, {});
}

export const signUp = async(name, email, password) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/signup`, {name, email, password}, {});
}

export const confirmation = async(email, token) => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/confirmation/${email}/${token}`, {}, {});
}

export const resendlink = async(email) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/resendlink`, {email}, {});
}

export const validatetoken = async(authtoken) => {
    var config = {
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/validateuser`,
        headers: { 
          'authtoken': authtoken
        }
    };
    return axios(config);
}