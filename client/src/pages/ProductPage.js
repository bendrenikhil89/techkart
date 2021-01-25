import React, {useEffect, useState} from 'react';
import ImageGallery from 'react-image-gallery';
import './Styles/ProductPage.css';
import { fetchProduct, rateProduct } from '../utils/product-util';
import {Tag, notification, Button, Modal, Rate} from 'antd';
import { HeartOutlined, ShoppingCartOutlined, StarFilled } from '@ant-design/icons';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

const ProductPage = ({match}) => {
    const [productDetails, setProductDetails] = useState({});
    const [productImages, setProductImages] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [avgRating, setAvgRating] = useState({avgRating: 0, totalRatings: 0});

    const slug = match.params.slug;
    const { user } = useSelector((state) => ({ ...state }));
    let email;
    let authtoken;
    let userID;
    if(user){
        email = user.email;
        authtoken = user.authtoken;
        userID = user._id;
    }
    
    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };
    
    const handleOk = async() => {
        try{
            await rateProduct(rating, authtoken, productDetails._id, email);
            fetchProductDetails();
            setIsModalVisible(false);
            openNotificationWithIcon('success', 'Rating Submitted', 'Your rating for the product is submitted!');
        }
        catch(err){
            setIsModalVisible(false);
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleRatingChange = (value) => {
        setRating(value);
    }

    const getExistingUserRating = (product) => {
        const userRating = product.ratings.find(p => {
            return p.postedBy === userID;
        });
        if(userRating && userRating.star){
            setRating(userRating.star);
        }
    }

    const getAverageProductRating = product => {
        const avgRating = product.ratings.reduce((sum, p) =>  {
            return sum + parseFloat(p.star);
        }, 0) / product.ratings.length;
        setAvgRating({avgRating, totalRatings: product.ratings.length});
    }

    const fetchProductDetails = async() => {
        try{
            let product = await fetchProduct(slug);
            if(product){
                setProductDetails(product.data);
                setProductImages(product.data.images.map(p => {
                    return {original: p.url, thumbnail: p.url}
                }));
                getExistingUserRating(product.data);
                if(product.data.ratings.length > 0) getAverageProductRating(product.data);
            }
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    } 
    
    const constructSpecifications = specs => {
        let specHTML="";
        let keyValue="";
        JSON.parse(specs).map((s,i) => { 
            for (const [key, value] of Object.entries(Object.values(s)[0])) {
                keyValue+=`<div class="product__details-spec-wrapper"><div class="spec-wrapper-columnName">
                            ${key}
                        </div>
                        <div class="spec-wrapper-columnValue">
                            ${value}
                        </div></div>`;
            }
            if(i === (JSON.parse(specs).length - 1)){
                specHTML += `<h3 class="product__details-spec-header">${Object.keys(s).toString()}</h3>${keyValue}` 
            }
            else{
                specHTML += `<h3 class="product__details-spec-header">${Object.keys(s).toString()}</h3>${keyValue}<hr class="product__details__hr">` 
            }
        });
        return specHTML;
    }

    useEffect(() => {
        fetchProductDetails();
    }, []);

    return (
        <>
        <div className="product__container">
            <div className="product__carousel">
                <div className="product__carousel-wrapper">
                    {productImages.length > 0 && <ImageGallery 
                        items={productImages}
                        showThumbnails={true} 
                        thumbnailPosition="left"
                        showIndex={true} 
                        showPlayButton={false}
                        showNav={false}
                        showFullscreenButton={false}  
                    />}
                </div>
                <div className="product__carousel-buttons">
                    <Button className="product__carousel-button" type="primary" icon={<HeartOutlined style={{fontSize:'1rem'}}/>} size="large">
                        <span className="product__carousel-buttonText">Wishlist</span>
                    </Button>
                    <Button className="product__carousel-button" type="primary" icon={<ShoppingCartOutlined style={{fontSize:'1rem'}}/>} size="large">
                        <span className="product__carousel-buttonText">Add to Cart</span>
                    </Button>
                </div>
            </div>

            <div className="product__details">
                <h3>{productDetails.title}</h3>
                <p onClick={() => setIsModalVisible(true)}><Tag color="#388e3c">{avgRating.avgRating} <StarFilled /></Tag> <span className="product__details-ratingsText">{avgRating.totalRatings} Rating{avgRating.totalRatings > 1 ? "s" : ""}</span></p>
                <h1>${productDetails.price}</h1>
                <div className="product__details-highlights">
                    <div className="product__details-highlights-columnName">
                        Highlights
                    </div>
                    <div className="product__details-highlights-columnValue">
                        <ul>
                            {productDetails.highlights && productDetails.highlights.split(';#').map((h, i) => {
                                return <li key={i}>{h}</li>
                            })}
                        </ul>
                    </div>
                </div>
                <div className="product__details-specifications">
                    <div className="product__details-specifications-header">
                        <h2>Specifications</h2>
                    </div>
                    {productDetails.specifications && 
                    <div dangerouslySetInnerHTML={{__html: constructSpecifications(productDetails.specifications)}}></div>}
                </div>
            </div>
        </div>
        <Modal title="Rate Product" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} centered>
            {user && user.authtoken ? <Rate defaultValue={0} onChange={handleRatingChange} value={rating}/> : <p>Please <Link to={{pathname:"/login", state: { source: `/product/${productDetails.slug}` }}}>login</Link> to rate a product!</p>}
        </Modal>
        </>
    )
}

export default ProductPage;
