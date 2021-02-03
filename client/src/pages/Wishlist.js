import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import LeftNav from '../components/LeftNav/LeftNav';
import {getWishlist, removeWishlist} from '../utils/user-util';
import { Avatar, Tooltip, Card , Image, Button, notification } from 'antd';
import { DeleteFilled, HeartOutlined, ShoppingCartOutlined, StarFilled } from '@ant-design/icons';
import CurrencyFormat from 'react-currency-format'; 
import './Styles/Wishlist.css';

const Wishlist = ({history}) => {
    const [wishlist, setWishlist] = useState([]);

    const links = [
        {to:"/my/profile", title:"Profile"},
        {to:"/my/passwordupdate", title:"Update Password"},
        {to:"/my/wishlist", title:"Wishlist"},
        {to:"/my/orders", title:"Orders"},
    ];

    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const {user} = useSelector(state => ({...state}));
    let authtoken, email, purchasedBy;
    if(user){
        authtoken = user.authtoken;
        email = user.email;
        purchasedBy = user._id;
    }
    
    const getUserWishlist = async() => {
        try{
            const user = await getWishlist(email, authtoken);
            setWishlist(user.data.user.wishlist);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const wishlistProductHandler = p => {
        history.push(`/product/${p.slug}`);
    }

    const wishlistRemoveHandler = async(p) => {
        try{
            const user = await removeWishlist(email, authtoken, p._id);
            let updatedWishlist = [...wishlist];
            setWishlist(updatedWishlist.filter(w => w._id !== p._id));
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    useEffect(() => {
        getUserWishlist();
    }, [])

    return (
        <div className="main__wrapper">
            <div className="main__leftnav">
                <LeftNav links={links} title="Account" active="/my/wishlist" />
            </div>
            <div className="main__content">
                <div className="wishlist__wrapper">
                    {wishlist && wishlist.length > 0 ? wishlist.map((c) => {
                        return <Card key={c._id}><div className="orders__products-wrapper wishlist__card">
                                    <div className="orders__products-img"><Avatar size="large" shape="square" src={<Image src={c.images[0].url} />}/></div>
                                    <div className="orders__products-title wishlist__product-title">
                                        <div onClick={() => wishlistProductHandler(c)}><Tooltip title={c.title}><p>{c.title.substring(0,80)}...</p></Tooltip></div>
                                        <div style={{fontSize:'0.8rem', color:'#757575',fontWeight:'600'}}>
                                            <CurrencyFormat value={c.price} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <span className="wishlist__price">{value}</span>} />
                                            <DeleteFilled className="wishlist__delete" onClick={() => wishlistRemoveHandler(c)} />
                                        </div>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </Card>
                    }) : null}
                </div>
            </div>
        </div>
    )
}

export default Wishlist;
