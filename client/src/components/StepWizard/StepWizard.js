import React, {useState, useEffect} from 'react';
import { Steps } from 'antd';
import {useLocation, useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';

import './StepWizard.css';

const StepWizard = () => {
    const { Step } = Steps;

    const [step, setStep] = useState(0);
    const location = useLocation();
    const history = useHistory();
    const {user} = useSelector(state => ({...state}));

    const getStepValue = () => {
        if(location.pathname === "/cart") setStep(0);
        if(user && location.pathname === "/checkout") setStep(1);
        if(user && location.pathname === "/payment") setStep(2);
    }

    const stepChangeHandler = current => {
        // if(current === 0){
        //     history.push("/cart");
        //     setStep(current);
        // } 
        // if(user && current === 1){
        //     history.push("/checkout");
        //     setStep(current);
        // }
        // if(user && current === 2){
        //     history.push("/payment");
        //     setStep(current);
        // }
    }

    useEffect(() => {
        getStepValue();
    }, [])

    return (
        <Steps className="site-navigation-steps" onChange={stepChangeHandler} current={step} style={{maxWidth:'1300px', margin:'0 auto', padding:'30px 16px 15px 16px'}} type="navigation" size="small">
            <Step title="Cart"></Step>
            <Step title="Checkout"></Step>
            <Step title="Payment"></Step>
        </Steps>
    )
}

export default StepWizard;
