import React, {useState, useEffect} from 'react';
import LeftNav from '../components/LeftNav/LeftNav';
import { Button, Tooltip, Collapse, Image, Divider, Select, notification } from 'antd';
import { CodeSandboxOutlined } from '@ant-design/icons';
import {useSelector} from 'react-redux';
import CurrencyFormat from 'react-currency-format'; 
import emptyOrders from '../assets/images/Empty_Orders.svg';
import noImage from '../assets/images/No_Image.png';

import { fetchAllOrdersAdmin, updateOrderAdmin } from '../utils/order-util';

import './Styles/Orders.css';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [updateOrder, setUpdateOrder] = useState({status:'', _id:''});
    const [activeCollapse, setActiveCollapse] = useState('0');
    const links = [
        {to:"/dashboard/admin/categories", title:"Categories"},
        {to:"/dashboard/admin/subcategories", title:"Sub Categories"},
        {to:"/dashboard/admin/products", title:"Products"},
        {to:"/dashboard/admin/bannerimages", title:"Banner Images"},
        {to:"/dashboard/admin/orders", title:"Orders"},
    ];

    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };
    const { Panel } = Collapse;
    const { Option } = Select;

    const {user} = useSelector(state => ({...state}));
    let authtoken, email;
    if(user){
        authtoken = user.authtoken;
        email = user.email;
    }

    function orderStatusChangeHandler(value, e) {
        setUpdateOrder({...updateOrder, status: value, _id:e.orderid});
    }

    const collapseOnChangeHandler = (key) => {
        setActiveCollapse(key.pop());
        setUpdateOrder({status:'', _id:''});
    }

    const updateOrderStatusHandler = async(e) => {
        e.preventDefault();
        try{
            const updatedOrder = await updateOrderAdmin(email, authtoken, updateOrder._id, updateOrder.status);
            setUpdateOrder({status:'', _id:''});
            openNotificationWithIcon('success','Order status updated successfully!', '');
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const getAllOrdersAdmin = async() => {
        try{
            const orders = await fetchAllOrdersAdmin(email, authtoken);
            setOrders(orders.data);
        }
        catch(err){
            console.log(err);
        }
    }

    const displayOrders = () => {
        return orders.map((o,i) => {
            return <Collapse activeKey={activeCollapse} onChange={collapseOnChangeHandler} key={o._id} className="orders__wrapper" defaultActiveKey={['0']} ghost style={{background:'#fff', padding:'0px 16px', marginTop:'16px'}} expandIconPosition="right"> 
                <Panel header={<p><CodeSandboxOutlined style={{marginRight:'10px'}} />Order No - <span style={{fontWeight:'600'}}>{o._id}</span> / Order Date - <span style={{fontWeight:'600'}}>{new Date(o.createdAt).toDateString()}</span> / Total - <span style={{fontWeight:'600'}}><CurrencyFormat value={o.paymentIntent.amount/100} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <span>{value}</span>} /></span><br />
                </p>} key={i}>
                <Select defaultValue={o.orderStatus} style={{ width: 150, marginBottom:'20px', marginRight:'20px' }} onChange={orderStatusChangeHandler}>
                    <Option value="Not Processed" orderid={o._id}>Not Processed</Option>
                    <Option value="Shipped" orderid={o._id}>Shipped</Option>
                    <Option value="Delivered" orderid={o._id}>Delivered</Option>
                    <Option value="Failed" orderid={o._id}>Failed</Option>
                </Select>
                <Button type="primary" onClick={updateOrderStatusHandler}>Update</Button>
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
        getAllOrdersAdmin();
    }, [])

    return (
        <div className="main__wrapper admin__wrapper">
            <div className="main__leftnav">
                <LeftNav links={links} title="Admin Dashboard" active="/dashboard/admin/orders" />
            </div>
            <div className="main__content">
                {orders && orders.length > 0 ? displayOrders() : <div className="orders__empty"><div><img src={emptyOrders} /><p>Your order history is empty!</p></div></div> } 
            </div>
        </div>
    )
}

export default ManageOrders;
