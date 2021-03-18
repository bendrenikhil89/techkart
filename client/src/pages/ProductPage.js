import React, {useEffect, useState} from 'react';
import ImageGallery from 'react-image-gallery';
import ItemsCarousel from 'react-items-carousel';
import useWindowDimensions from '../Hooks/useWindowDimensions';
import ProductCard from '../components/Card/ProductCard/ProductCard';
import { fetchProduct, rateProduct, fetchSimilarProducts } from '../utils/product-util';
import { addWishlist, getWishlist } from '../utils/user-util';
import {Tag, notification, Button, Modal, Rate} from 'antd';
import { HeartOutlined, ShoppingCartOutlined, StarFilled, RightOutlined, LeftOutlined } from '@ant-design/icons';
import {useSelector, useDispatch} from 'react-redux';
import CurrencyFormat from 'react-currency-format';
import {Link} from 'react-router-dom';
import noImage from '../assets/images/No_Image.svg';

import './Styles/ProductPage.css';

const ProductPage = ({match, history}) => {
    const [productDetails, setProductDetails] = useState({});
    const [similarProducts, setSimilarProducts] = useState({});
    const [productImages, setProductImages] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [avgRating, setAvgRating] = useState({avgRating: 0, totalRatings: 0});
    const [addedInCart, setAddedInCart] = useState(false);
    const [addedInWishlist, setAddedInWishlist] = useState(false);
    const [userWishlist, setUserWishlist] = useState([]);

    const [activeItemIndexSimilarProducts, setActiveItemIndexSimilarProducts] = useState(0);
    let itemCarouselCount = 1;
    const { width } = useWindowDimensions();
    if(width >= 1024){
        itemCarouselCount = 4;
    }
    else if(width >= 568 && width < 1024){
        itemCarouselCount = 2;
    }

    const dispatch = useDispatch();

    const slug = match.params.slug;
    const { user, cart } = useSelector((state) => ({ ...state }));
    let email;
    let authtoken;
    let userID;
    if(user){
        email = user.email;
        authtoken = user.authtoken;
        userID = user._id;
    }

    const addCartHandler = (p) => {
        let cart = [];
        if(typeof window !== 'undefined'){
          if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            let productInCart = cart.find(c => {
              return c._id === p._id;
            });
            if(!productInCart){
              cart.push({...p, count:1});
              localStorage.setItem('cart', JSON.stringify(cart));
              dispatch({
                type: 'ADD_TO_CART',
                payload: cart
              });
              dispatch({
                type: 'SHOW_HIDE_DRAWER',
                payload: true
              });
            }
          }
          else{
            cart.push({...p, count:1});
            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
              type: 'ADD_TO_CART',
              payload: cart
            });
            dispatch({
                type: 'SHOW_HIDE_DRAWER',
                payload: true
            });
          }
          setAddedInCart(true);
        }
    }

    const addToWishlistHandler = async(p) => {
        try{
            await addWishlist(email, authtoken, p._id);
            setAddedInWishlist(true);
            openNotificationWithIcon('success', 'Product added to wishlist', '');
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const getUserWishlist = async() => {
        try{
            const user = await getWishlist(email, authtoken);
            setUserWishlist(user.data.user.wishlist);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const checkIfProductInWishlist = () => {
        if(userWishlist && userWishlist.length > 0){
            let productAdded = userWishlist.find(u => {
                return u._id === productDetails._id;
            });
            if(productAdded){
                return true
            }
            else {
                return false;
            }
        }
    }

    const checkIfProductInCart = () => {
        if(cart && cart.length > 0){
            let productAdded = cart.find(c => {
                return c._id === productDetails._id;
            });
            if(productAdded){
                setAddedInCart(true);
            }
        }
    }
    
    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };
    
    const handleOk = async() => {
        try{
            await rateProduct(rating, avgRating, authtoken, productDetails._id, email);
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
                getSimilarProducts(product.data._id, product.data.category);
                if(product.data.ratings.length > 0) getAverageProductRating(product.data);
            }
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    } 
    
    const getSimilarProducts = async(_id, category) => {
        try{
            const products = await fetchSimilarProducts(_id, category, 8);
            setSimilarProducts(products.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const constructSpecifications = specs => {
        let specHTML="";
        let keyValue="";
        JSON.parse(specs).forEach((s,i) => { 
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
        getUserWishlist();
    }, [addedInWishlist,addedInCart]);

    useEffect(() => {
        checkIfProductInCart();
    }, [productDetails])

    return (
        <>
        <div className="product__container">
            <div className="product__carousel">
                <div className="product__carousel-wrapper">
                    {productImages.length > 0 ? <ImageGallery 
                        items={productImages}
                        showThumbnails={true} 
                        thumbnailPosition="left"
                        showIndex={true} 
                        showPlayButton={false}
                        showNav={false}
                        showFullscreenButton={false}
                    /> : <img src={noImage} style={{width:'100%',height:'45vh'}}/>}
                </div>
                <div className="product__carousel-buttons">
                    {!addedInWishlist ? <Button className="product__carousel-button" type="primary" icon={<HeartOutlined style={{fontSize:'1rem'}}/>} size="large" onClick={() => addToWishlistHandler(productDetails)}>
                        <span className="product__carousel-buttonText">Wishlist</span>
                    </Button> : <Button className="product__carousel-button" type="primary" icon={<HeartOutlined style={{fontSize:'1rem'}}/>} size="large">
                        <span className="product__carousel-buttonText">Wishlisted</span>
                    </Button>}
                    {!addedInCart ? <Button className="product__carousel-button" type="primary" icon={<ShoppingCartOutlined style={{fontSize:'1rem'}}/>} size="large" onClick={() => addCartHandler(productDetails)}>
                        <span className="product__carousel-buttonText">Add to cart</span>
                    </Button> : <Button className="product__carousel-button" type="primary" icon={<ShoppingCartOutlined style={{fontSize:'1rem'}}/>} size="large" onClick={() => history.push("/cart")}>
                        <span className="product__carousel-buttonText">Go to cart</span>
                    </Button>}
                </div>
            </div>

            <div className="product__details">
                <h3>{productDetails.title}</h3>
                <p onClick={() => setIsModalVisible(true)}><Tag color="#388e3c">{avgRating.avgRating} <StarFilled /></Tag> <span className="product__details-ratingsText">{avgRating.totalRatings} Rating{avgRating.totalRatings > 1 ? "s" : ""}</span></p>
                <h1><CurrencyFormat value={productDetails.price} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <span>{value}</span>} /></h1>
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
        
        <div className="product__similar-products">
        <h2>Similar Products</h2>
        <div className="product__similar-products-wrapper" style={{"maxWidth":"1300px","margin":"0 auto"}}>
            {similarProducts && similarProducts.length > 0 ? <ItemsCarousel
                numberOfCards={itemCarouselCount}
                infiniteLoop={false}
                gutter={16}
                activePosition={'center'}
                chevronWidth={60}
                disableSwipe={false}
                alwaysShowChevrons={false}
                slidesToScroll={1}
                outsideChevron={false}
                showSlither={false}
                firstAndLastGutter={false}
                activeItemIndex={activeItemIndexSimilarProducts}
                requestToChangeActive={value => setActiveItemIndexSimilarProducts(value)}
                rightChevron={<button className="ant-btn ant-btn-circle">{<RightOutlined />}</button>}
                leftChevron={<button className="ant-btn ant-btn-circle">{<LeftOutlined />}</button>}
            >
                {similarProducts.map(p=>{
                    return <ProductCard p={p} key={p._id}/>
                    })
                }
            </ItemsCarousel> : <p>No similar products found!</p>}
        </div>
        </div>

        <Modal title="Rate Product" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} centered>
            {user && user.authtoken ? <Rate defaultValue={0} onChange={handleRatingChange} value={rating}/> : <p>Please <Link to={{pathname:"/login", state: { source: `/product/${productDetails.slug}` }}}>login</Link> to rate a product!</p>}
        </Modal>
        </>
    )
}

export default ProductPage;
