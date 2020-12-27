import axios from 'axios';

export const fetchAll = async() => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/categories`, {}, {});
}

export const create = async(name, email, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/category`, {name, email}, {
        headers: {
            authtoken
        }
    });
}

export const remove = async(authtoken, slug, email) => {
    var data = JSON.stringify({"email":email});
    var config = {
        method: 'delete',
        url: `${process.env.REACT_APP_API_URL}/category/${slug}`,
        headers: { 
            'authtoken': authtoken, 
            'Content-Type': 'application/json'
        },
        data : data
    };

    return await axios(config);
}

export const update = async(name, email, authtoken, slug) => {
    return await axios.put(`${process.env.REACT_APP_API_URL}/category/${slug}`, {name, email}, {
        headers: {
            authtoken
        }
    })
}