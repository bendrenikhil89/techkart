import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import { Divider, Form, Button, notification } from 'antd';
import CurrencyFormat from 'react-currency-format';
import {getCart, addAddress} from '../utils/user-util';
import {useHistory} from 'react-router-dom';
import './Styles/Checkout.css';
import AddressForm from '../components/Forms/AddressForm';
import StepWizard from '../components/StepWizard/StepWizard';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const Checkout = () => {
const {user} = useSelector(state => ({...state}));
const {email, authtoken} = user;
const [cartContent, setCartContent] = useState([]);
const [address, setAddress] = useState({deliveryAddress: '', mode: ''});
const [dbAddress, setDBAddress] = useState('');
const [loading, setLoading] = useState(false);
const [visible, setVisible] = useState(false);

const history = useHistory();
const [form] = Form.useForm();

const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
    notification[type]({
      message: msgTitle,
      description: msgBody
    });
};

const getCartFromDB = async() => {
    setLoading(true);
    try{
        const userCart = await getCart(email, authtoken);
        setCartContent(userCart.data.cart);
        setDBAddress(userCart.data.address);
        setAddress({...address, deliveryAddress : userCart.data.address});
    }
    catch(err){
        openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
    }
    finally{
        setLoading(false);
    }
}

const totalCartValue = () => {
    return cartContent.reduce((total,curr) => total + (curr.count * curr.price), 0);
}

const addAddressHandler = async(e) => {
    e.preventDefault();
    setLoading(true);
    try{
        await addAddress(email, authtoken, address.deliveryAddress);
        setDBAddress(address.deliveryAddress);
        openNotificationWithIcon('success',"Address add/update successful", "Delivery address is added/updated succesfully!");
        setVisible(false);
    }
    catch(err){
        openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
    }
    finally{
        setLoading(false);
    }
}

const editAddressHandler = (e) => {
    e.preventDefault();
    setAddress({...address, mode : 'edit', deliveryAddress: dbAddress});
    setVisible(true);
}

const displayDeliveryAddress = () => {
    const jsonAddress = JSON.parse(dbAddress);
    return (
        <div className="checkout__addresswrapper">
            <p><strong>{jsonAddress.name}</strong></p>
            <p>{jsonAddress.streetAdd}, {jsonAddress.locality}, </p>
            <p>{jsonAddress.city}, {jsonAddress.state} - {jsonAddress.pinCode}</p>
            <p>Mobile: <strong>{jsonAddress.mobile}</strong></p>
            <Button type="primary" size="small" onClick={editAddressHandler}>EDIT</Button>
        </div>
    );
}

const placeOrderHandler = e => {
    e.preventDefault();
    history.push("/payment");
}

useEffect(() => {
    getCartFromDB();
}, []);

    return (
        <>
        <StepWizard />
        <div className="checkout__wrapper">
            {!loading && cartContent && cartContent.length>0 ?
            <>
            <div className="checkout__left">
                <h3>Delivery Address</h3>
                {(dbAddress === undefined || dbAddress === "" || visible) && <AddressForm 
                    form={form}
                    loading={loading}
                    visible={visible}
                    setVisible={setVisible}
                    address={address}
                    setAddress={setAddress}
                    addAddressHandler={addAddressHandler}
                />}
                {dbAddress !== undefined && dbAddress !== "" && displayDeliveryAddress(dbAddress)}
                <Divider />
                <div className="cart__placeorderWrapper">
                    <Button className="cart__placeorder" type="primary" size="default" disabled={dbAddress !== undefined && dbAddress !== "" ? false : true} onClick={placeOrderHandler}>
                        <span className="cart__placeorderText">PLACE ORDER</span>
                    </Button>
                </div>
            </div>
            <div className="checkout__right">
                <h3>Order Summary</h3>
                <div className="cart__priceBreakdown">
                    <div className="cart__priceLabel">
                        <p>Price ({cartContent.length} product{cartContent.length > 1 ? `s` : null})</p>
                    </div>
                </div>
                {cartContent.map(c => {
                    return <div className="cart__priceBreakdown" key={c._id}>
                        <div className="cart__priceLabel">
                            <p>{c.title.substring(0, 50)}... x <strong>{c.count}</strong></p>
                        </div>
                        <div className="cart__priceNum">
                            <p><CurrencyFormat value={c.price} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <span>{value}</span>} /></p>
                        </div>
                    </div>
                })}
                <hr style={{width:'90%', margin:'0 auto', borderTop:'1px dashed #ccc'}} />
                <div className="cart__priceBreakdown">
                    <div className="cart__priceLabel">
                        <p>Total Amount: </p>
                    </div>
                    <div className="cart__priceNum">
                        <p><strong><CurrencyFormat value={totalCartValue()} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <span>{value}</span>} /></strong></p>
                    </div>
                </div>
            </div>
            </> : <LoadingSpinner />}
        </div>
        </>
    )
}

export default Checkout;
