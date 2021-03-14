import React from 'react';
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import StepWizard from '../components/StepWizard/StepWizard';
import { Alert } from 'antd';

import './Styles/Payment.css';
import StripeCheckout from '../components/StripeCheckout/StripeCheckout';

const stripePromise = loadStripe("pk_test_51IFM3kCg1xNJ4xUP0ApJFsKnjoXnFVqrthD1aC23KEYauakcOvYPMb3MNsMfbDKRBpmKNnpS0RYVii1L8HdD7EJp00gaCUtbyO");

const Payment = () => {
    return (
        <>
            <StepWizard />
            <Alert style={{maxWidth: '600px',margin:'20px auto', borderRadius:'5px'}} message="Enter 4242 4242 4242 4242 to make the payment. Please note, this is a test card no!" type="info" showIcon />
            <Elements stripe={stripePromise}>
                <div className="payment__wrapper">
                    <div className="payment__card"><StripeCheckout /></div>
                </div>
            </Elements>
        </>
    )
}

export default Payment;
