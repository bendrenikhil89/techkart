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
            <Elements stripe={stripePromise}>
                <div className="payment__wrapper">
                    <div className="payment__card"><StripeCheckout /></div>
                </div>
            </Elements>
        </>
    )
}

export default Payment;
