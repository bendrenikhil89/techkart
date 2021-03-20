import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import LeftNav from '../components/LeftNav/LeftNav';
import {getWishlist, removeWishlist} from '../utils/user-util';
import { Tooltip, Card , Image, notification, Skeleton } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import CurrencyFormat from 'react-currency-format'; 
import emptyWishlist from '../assets/images/Empty_Wishlist.svg';
import './Styles/Wishlist.css';
import noImage from '../assets/images/No_Image.png';

const Wishlist = ({history}) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

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
    let authtoken, email;
    if(user){
        authtoken = user.authtoken;
        email = user.email;
    }
    
    const getUserWishlist = async() => {
        try{
            const user = await getWishlist(email, authtoken);
            setWishlist(user.data.user.wishlist);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
        finally{
            setLoading(false);
        }
    }

    const wishlistProductHandler = p => {
        history.push(`/product/${p.slug}`);
    }

    const wishlistRemoveHandler = async(p) => {
        try{
            await removeWishlist(email, authtoken, p._id);
            let updatedWishlist = [...wishlist];
            openNotificationWithIcon('success','Product removed from wishlist', '');
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
                    {loading ? <Card><Skeleton /></Card> :
                    <>
                    {wishlist && wishlist.length > 0 ? wishlist.map((c) => {
                        return <Card key={c._id}><div className="orders__products-wrapper wishlist__card">
                                    <div className="orders__products-img"><Image src={c.images.length > 0 ? c.images[0].url : noImage} /></div>
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
                    }) : <div className="orders__empty"><div><img src={emptyWishlist} alt="Empty wishlist" /><p>Your wishlist is empty!</p></div></div>}</>}
                </div>
            </div>
        </div>
    )
}

export default Wishlist;
