import React, {useEffect, useState} from 'react';
import ImageGallery from 'react-image-gallery';
import './Styles/ProductPage.css';
import { fetchProduct } from '../utils/product-util';
import {Tag, notification, Button, Divider} from 'antd';
import { HeartOutlined, ShoppingCartOutlined, StarFilled } from '@ant-design/icons';

const ProductPage = ({match}) => {
    const [productDetails, setProductDetails] = useState({});
    const [productImages, setProductImages] = useState([]);
    const slug = match.params.slug;
    
    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const fetchProductDetails = async() => {
        try{
            let product = await fetchProduct(slug);
            if(product){
                setProductDetails(product.data);
                setProductImages(product.data.images.map(p => {
                    return {original: p.url, thumbnail: p.url}
                }));
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
                <p><Tag color="#388e3c">4.4 <StarFilled /></Tag> <span className="product__details-ratingsText">5364 Ratings</span></p>
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
    )
}

export default ProductPage;
