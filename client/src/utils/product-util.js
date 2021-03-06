import axios from 'axios';

export const createProduct = async(product, email, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/product`, {product, email}, {
        headers: {
            authtoken
        }
    });
}

export const fetchProductsByPageSize = async(sort, order, page, pageSize) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/products`, {sort, order, page, pageSize},{});
}

export const fetchAllProducts = async(count = 5000) => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/products/${count}`, {}, {});
}

export const fetchProduct = async(slug) => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/product/${slug}`, {}, {});
}

export const removeProduct = async(authtoken, slug, email) => {
    var data = JSON.stringify({"email":email});
    var config = {
        method: 'delete',
        url: `${process.env.REACT_APP_API_URL}/product/${slug}`,
        headers: { 
            'authtoken': authtoken, 
            'Content-Type': 'application/json'
        },
        data : data
    };

    return await axios(config);
}

export const updateProduct = async(product, email, authtoken, slug) => {
    return await axios.put(`${process.env.REACT_APP_API_URL}/product/${slug}`, {product, email}, {
        headers: {
            authtoken
        }
    })
}

export const rateProduct = async(rating, avgRating, authtoken, slug, email) => {
    return await axios.put(`${process.env.REACT_APP_API_URL}/product/star/${slug}`,{rating, avgRating, email}, {
        headers: {
            authtoken
        }
    })
}

export const fetchFilteredProducts = async(param) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/search/filters`,param, {})
}

export const fetchProductsByCategory = async(category) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/productsByCategory`,category, {})
}

export const fetchProductsCount = async(filter) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/productscount`, filter, {})
}

export const fetchBrands = async() => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/productsbrand`, {}, {})
}

export const fetchSimilarProducts = async(_id, category, perPage) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/products/similar`, {_id, category, perPage}, {})
}