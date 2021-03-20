import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import {createPaymentIntent} from '../../utils/stripe-util';
import { Alert, Result, Button } from 'antd';
import { createOrder } from '../../utils/order-util';
import {Link} from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';

const StripeCheckout = ({history}) => {
    const dispatch = useDispatch();
    const { user, cart } = useSelector(state => ({...state}));
    const {email, authtoken, _id} = user;

    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(false);
    const [orderID, setOrderID] = useState(null);

    const stripe = useStripe();
    const elements = useElements();

    const cartStyle = {
        style: {
          base: {
            color: "#32325d",
            fontFamily: "'Open Sans', sans-serif",
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#32325d",
            },
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
          },
        },
    };

    const paymentIntent = async() => {
        try{
            const paymentIntent = await createPaymentIntent(email, authtoken);
            setClientSecret(paymentIntent.data.clientSecret);
        }
        catch(err){
            console.log(err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try{
            const payLoad = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: e.target.name.value,
                    }
                }
            });
            let newOrder = await createOrder(email, authtoken, _id, payLoad.paymentIntent);
            if(newOrder){
                if(typeof window !== undefined) localStorage.removeItem("cart");
                dispatch({
                    type: 'REMOVE_FROM_CART',
                    payload: []
                });
                setOrderID(newOrder.data._id);
            }
            setError(null);
            setProcessing(false);
            setSucceeded(true);
        }
        catch(err){
            setError(`Payment failed! ${err.message}`);
            setProcessing(false);
        }
    };
    
    const handleChange = async (e) => {
        setDisabled(e.empty); //disabled pay button in case of errors
        setError(e.error ? e.error.message : "");
    };

    useEffect(() => {
        paymentIntent();
    }, []);
    return (
        <>
            {succeeded ? <Result
                style={{background:'#fff'}}
                status="success"
                title="Payment Successful!"
                subTitle={`Order number - ${orderID}. You can view this order in your order history.`}
                extra={[
                    <Button size="default" type="primary" style={{width:'150px'}}><Link to="/my/orders">ORDER HISTORY</Link></Button>,
                    <Button size="default" type="primary" style={{width:'150px'}}><Link to="/shop">SHOP</Link></Button>
                ]}
            />
            :
            <>
            <Alert style={{maxWidth: '600px',margin:'20px auto', borderRadius:'5px'}} message="Enter 4242 4242 4242 4242 to make the payment. Please note, this is a test card no!" type="info" showIcon />
            <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
                <h3>Complete your purchase</h3>
                <CardElement
                    id="card-element"
                    options={cartStyle}
                    onChange={handleChange}
                />
                <button
                className="stripe-button"
                disabled={processing || disabled || succeeded}
                >
                <span id="button-text">
                    <CurrencyFormat value={cart.reduce((total,curr) => total + (curr.count * curr.price), 0)} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <span>{`Pay ${value}`}</span>} />
                </span>
                </button>
                <br />
                {error && <Alert message={error} type="error" showIcon />}
            </form></>}
        </>
    )
}

export default StripeCheckout;
