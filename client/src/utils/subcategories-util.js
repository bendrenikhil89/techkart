import axios from 'axios';

export const fetchAllSubCategories = async() => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/subcategories`, {}, {});
}

export const fetchLookupSubCategories = async(parent) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/lookupsubcategories`, {parent}, {});
}

export const createSubCategory = async(sub, email, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/subcategory`, {sub, email}, {
        headers: {
            authtoken
        }
    });
}

export const updatesubCategory = async(sub, email, authtoken, slug) => {
    return await axios.put(`${process.env.REACT_APP_API_URL}/subcategory/${slug}`, {sub, email}, {
        headers: {
            authtoken
        }
    })
}

export const removeSubCategory = async(authtoken, slug, email) => {
    var data = JSON.stringify({"email":email});
    var config = {
        method: 'delete',
        url: `${process.env.REACT_APP_API_URL}/subcategory/${slug}`,
        headers: { 
            'authtoken': authtoken, 
            'Content-Type': 'application/json'
        },
        data : data
    };

    return await axios(config);
}