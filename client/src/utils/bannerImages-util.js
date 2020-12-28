import axios from "axios";

export const uploadBannerImage = async(image, authtoken, email) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/uploadbannerimage`, {image, email}, {
        headers: {
            authtoken
        }
    });
}

export const removeBannerImage = async(public_id, authtoken, email) => {
    var data = JSON.stringify({"public_id": public_id,"email":email});
    var config = {
        method: 'delete',
        url: `${process.env.REACT_APP_API_URL}/removebannerimage`,
        headers: { 
            'authtoken': authtoken, 
            'Content-Type': 'application/json'
        },
        data : data
    };

    return await axios(config);
}

export const fetchBannerImages = async() => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/bannerimages`, {}, {});
}