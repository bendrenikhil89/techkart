import React, {useState, useEffect} from 'react';
import LeftNav from '../components/LeftNav/LeftNav';
import { Tag, Tooltip, Collapse, Image, Divider } from 'antd';
import { CodeSandboxOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import {fetchAllOrders} from '../utils/order-util';
import {useSelector} from 'react-redux';
import CurrencyFormat from 'react-currency-format'; 
import emptyOrders from '../assets/images/Empty_Orders.svg';
import noImage from '../assets/images/No_Image.png';

import './Styles/Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const links = [
        {to:"/my/profile", title:"Profile"},
        {to:"/my/passwordupdate", title:"Update Password"},
        {to:"/my/wishlist", title:"Wishlist"},
        {to:"/my/orders", title:"Orders"},
    ];

    const { Panel } = Collapse;

    const {user} = useSelector(state => ({...state}));
    let authtoken, email, purchasedBy;
    if(user){
        authtoken = user.authtoken;
        email = user.email;
        purchasedBy = user._id;
    }

    const getAllOrders = async() => {
        try{
            const orders = await fetchAllOrders(email, authtoken, purchasedBy);
            setOrders(orders.data);
        }
        catch(err){
            console.log(err);
        }
    }

    const orderStatus = status => {
        if(status === "Not Processed") return <Tag style={{marginTop:'10px'}} icon={<ClockCircleOutlined />} color="warning">Not Processed</Tag>
        if(status === "Shipped") return <Tag style={{marginTop:'10px'}} icon={<SyncOutlined spin />} color="processing">Shipped</Tag>
        if(status === "Delivered") return <Tag style={{marginTop:'10px'}} icon={<CheckCircleOutlined />} color="success">Delivered</Tag>
        if(status === "Failed") return <Tag style={{marginTop:'10px'}} icon={<CloseCircleOutlined />} color="error">Order Failed</Tag>
    }

    const displayOrders = () => {
        return orders.map((o,i) => {
            return <Collapse key={o._id} className="orders__wrapper" defaultActiveKey={['0']} ghost style={{background:'#fff', padding:'0px 16px', marginTop:'16px'}} expandIconPosition="right"> 
                <Panel header={<p><CodeSandboxOutlined style={{marginRight:'10px'}} />Order No - <span style={{fontWeight:'600'}}>{o._id}</span> / Order Date - <span style={{fontWeight:'600'}}>{new Date(o.createdAt).toDateString()}</span> / Total - <span style={{fontWeight:'600'}}><CurrencyFormat value={o.paymentIntent.amount/100} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <span>{value}</span>} /></span><br />{orderStatus(o.orderStatus)}</p>} key={i}>
                    {o.products.map((c,index) => {
                        return <div key={c._id}><div className="orders__products-wrapper">
                            <div className="orders__products-img"><Image src={c.images.length > 0 ? c.images[0].url : noImage} /></div>
                            <div className="orders__products-title">
                                <div><Tooltip title={c.title}><p>{c.title.substring(0,80)}...</p></Tooltip></div>
                                <div style={{fontSize:'0.8rem', color:'#757575'}}>Price : <CurrencyFormat value={c.price} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <span>{value}</span>} /> * {c.count} = <CurrencyFormat value={c.count * c.price} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <span>{value}</span>} /></div>
                            </div>
                        </div>{index === o.products.length-1 ? null : <Divider />}</div>
                    })}
                </Panel>
                
        </Collapse>});
    }

    useEffect(() => {
        getAllOrders();
    }, []);

    return (
        <div className="main__wrapper">
            <div className="main__leftnav">
                <LeftNav links={links} title="Account" active="/my/orders" />
            </div>
            <div className="main__content">
                {orders && orders.length > 0 ? displayOrders() : <div className="orders__empty"><div><img src={emptyOrders} /><p>Your order history is empty!</p></div></div> } 
            </div>
        </div>
    )
}

export default Orders;
