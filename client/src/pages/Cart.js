import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import { Divider, Image, InputNumber, Button, Tag } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import emptyCart from '../assets/images/emptycart.png';

import './Styles/Cart.css';

const Cart = () => {
    const {user, cart} = useSelector(state => ({...state}));
    const [cartContent, setCartContent] = useState(cart);
    const dispatch = useDispatch();

    function updateCartQuantity(value, cartDetails) {
        let currCart = [...cartContent];
        let currItem = currCart.find(c => {
            return c._id === cartDetails._id;
        });
        if(currItem){
            currItem.count = value;
        }
        setCartContent([...currCart]);
        localStorage.setItem("cart", JSON.stringify(currCart));
        dispatch({
            type: 'ADD_TO_CART',
            payload: currCart
        });
    }

    function removeProduct(cartDetails){
        let currCart = [...cartContent];
        let currItem = currCart.findIndex(c => {
            return c._id === cartDetails._id;
        });
        if(currItem !== 'undefined' && currItem !== null){
            currCart.splice(currItem, 1);
            setCartContent([...currCart]);
            currCart.length> 0 ? localStorage.setItem("cart", JSON.stringify(currCart)) : localStorage.removeItem("cart");
            dispatch({
                type: 'ADD_TO_CART',
                payload: currCart
            });
        }
    }

    const productCart = (cartDetails) => {
        return <><div className="productDetails__wrapper">
            <div className="productDetails__image">
                <Image width={100} src={cartDetails.images[0].url} style={{cursor:'pointer'}} />
            </div>
            <div className="productDetails__details">
                <p>{cartDetails.title}<span style={{paddingLeft:"20px"}}>{cartDetails.quantity > 0 ? <Tag color="#87d068">In stock</Tag> : <Tag color="default">Out of stock</Tag> }</span></p>
                <p><strong>$ {cartDetails.price}</strong></p>
                <div style={{display:'flex'}}>
                    <div style={{marginRight:'20px',display:'flex',alignItems:'center'}}>
                        <span style={{marginRight:'10px'}}>Quantity:</span><InputNumber min={1} max={cartDetails.quantity} defaultValue={cartDetails.count} onChange={value => updateCartQuantity(value, cartDetails)} />
                    </div>
                    <div  style={{display:'flex',alignItems:'center'}}>
                        <span style={{marginRight:'10px'}}><DeleteFilled style={{color:'#757575',fontSize:'1rem', cursor:'pointer'}} onClick={() => removeProduct(cartDetails)} /></span>
                    </div>
                </div>
            </div>
        </div>
        <Divider />
        </>
    };

    const totalCartValue = () => {
        return cart.reduce((total,curr) => total + (curr.count * curr.price), 0);
    }

    const totalCartProductsCount = () => {
        return cart.reduce((total,curr) => total + curr.count, 0);
    }

    return (
        <div className="cart__wrapper">
            {cart && cart.length>0 ? 
            <><div className="cart__productDetails">
                <h3>My Cart {cart && cart.length>0 ? `(${totalCartProductsCount()})` : null}</h3>
                {cart.map(c => {
                    return <div key={c._id}>{productCart(c)}</div>;
                })}
                {user ? <div className="cart__placeorderWrapper"><Button className="cart__placeorder" type="primary" size="large">
                        <span className="cart__placeorderText">PLACE ORDER</span>
                    </Button></div> : <Link to={{pathname:"/login", state: { source: "/cart" }}}><div className="cart__placeorderWrapper"><Button type="primary" size="large">Login to checkout</Button></div></Link>}
            </div>
            <div className="cart__priceDetails">
                <h3>PRICE DETAILS</h3>
                <div className="cart__priceBreakdown">
                    <div className="cart__priceLabel">
                        <p>Price ({cart.length} product{cart.length > 1 ? `s` : null})</p>
                    </div>
                </div>
                {cart.map(c => {
                    return <div className="cart__priceBreakdown" key={c._id}>
                        <div className="cart__priceLabel">
                            <p>{c.title.substring(0, 50)}... x <strong>{c.count}</strong></p>
                        </div>
                        <div className="cart__priceNum">
                            <p>${c.price}</p>
                        </div>
                    </div>
                })}
                <hr style={{width:'90%', margin:'0 auto', borderTop:'1px dashed #ccc'}} />
                <div className="cart__priceBreakdown">
                    <div className="cart__priceLabel">
                        <p>Total Amount: </p>
                    </div>
                    <div className="cart__priceNum">
                        <p><strong>${totalCartValue()}</strong></p>
                    </div>
                </div>
            </div></> : 
            <div className="cart__productDetails cart__empty">
                <div>
                    <img src={emptyCart} />
                    <p>Your cart is empty</p>
                    <div className="cart__empty-shopnow"><Link to="/shop"><Button type="primary" size="large">Shop now</Button></Link></div>
                </div>
            </div> }
        </div>
    )
}

export default Cart;