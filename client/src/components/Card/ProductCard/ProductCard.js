import React, {useState, useEffect} from 'react';
import {Tag, Card, Tooltip, Rate} from 'antd';
import {EyeOutlined, StarFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import CurrencyFormat from 'react-currency-format';

const ProductCard = ({p}) => {
    const [avgRating, setAvgRating] = useState({avgRating: 0, totalRatings: 0});
    const [quantity, setQuantity] = useState(0);
    const [tooltip, setTooltip] = useState("Click to add");

    const dispatch = useDispatch();

    const getAverageProductRating = product => {
      const avgRating = product.ratings.reduce((sum, p) =>  {
          return sum + parseFloat(p.star);
      }, 0) / product.ratings.length;
      setAvgRating({avgRating, totalRatings: product.ratings.length});
      setQuantity(product.quantity);
    }

    const addCartHandler = () => {
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
            setTooltip("Added");
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
          setTooltip("Added");
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
    }

    useEffect(() => {
      getAverageProductRating(p);
    }, [])
    return (
      <Card
        key={p._id}
        cover={
          p.images.length > 0 ? (
            <img alt={p.title} src={p.images[0].url} />
          ) : (
            <img src="data:image/png;base64,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" />
          )
        }
        hoverable
        actions={[
          <Link to={`/product/${p.slug}`}>
            <EyeOutlined key="view" />
            <br /> View Product
          </Link>,
          <div onClick={quantity > 0 ? addCartHandler: null}>
            {quantity > 0 ? <Tooltip title={tooltip}>
              <ShoppingCartOutlined key="cart" />
              <br /> Add To Cart
            </Tooltip> : <Tooltip title="Out of stock">
              <ShoppingCartOutlined key="cart" />
              <br /> Out Of Stock
            </Tooltip>}
          </div>,
        ]}
      >
        <Tooltip title={p.title}>
          <Card.Meta 
            title={p.title} 
            description={avgRating.avgRating > 0 ? 
              <p>{<span style={{marginBottom:'8px !important', fontWeight:'600', fontSize:'0.9rem', color:'#323a32', paddingRight:'20px', borderRight:"1px solid #ccc"}}><CurrencyFormat value={p.price} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <span>{value}</span>} /></span>}<span style={{paddingLeft:'20px'}}><Tag color="#388e3c">{avgRating.avgRating} <StarFilled /></Tag> <span className="product__details-ratingsText">{avgRating.totalRatings} Rating{avgRating.totalRatings > 1 ? "s" : ""}</span></span></p> 
              : <p>{<span style={{marginBottom:'8px !important', fontWeight:'600', fontSize:'0.9rem', color:'#323a32', paddingRight:'20px', borderRight:"1px solid #ccc"}}><CurrencyFormat value={p.price} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <span>{value}</span>} /></span>}<span style={{paddingLeft:'20px'}}>No rating yet</span></p>}/>
        </Tooltip>
      </Card>
    );
}

export default ProductCard
