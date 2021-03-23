import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar, Drawer, Image, Tooltip, Button} from 'antd';
import {useHistory} from 'react-router-dom';
import noImage from '../../assets/images/No_Image.png';

import './CartDrawer.css';

const CartDrawer = () => {
    const {user, cart, drawer} = useSelector(state => ({...state}));
    const dispatch = useDispatch();
    const history = useHistory();

    const onCartDrawerClose = () => {
        dispatch({
            type: 'SHOW_HIDE_DRAWER',
            payload: false
        });
    };

    const goToCartHandler = () => {
        dispatch({
            type: 'SHOW_HIDE_DRAWER',
            payload: false
        });
        history.push("/cart");
    }

    return (
        <Drawer
            title="Your cart"
            width={window.innerWidth > 768 ? 300 : window.innerWidth - 75}
            placement="right"
            closable={true}
            onClose={onCartDrawerClose}
            visible={drawer}
        >
            {cart && cart.length > 0 && cart.map(c => {
                return <div className="cart__drawer-wrapper" key={c._id}>
                    <div className="cart__drawer-img"><Avatar size="large" shape="square" src={<Image src={c.images.length > 0 ? c.images[0].url : noImage} />}/></div>
                    <div className="cart__drawer-title"><Tooltip title={c.title} placement="leftBottom"><p>{c.title.substring(0,40)}...</p></Tooltip></div>
                </div>
            })}
            <Button className="cart__placeorder" type="primary" size="default" style={{width:'100%', marginTop:'10px'}} onClick={goToCartHandler}>
                <span className="cart__placeorderText">Go to cart</span>
            </Button> 
        </Drawer>
    )
}

export default CartDrawer;
