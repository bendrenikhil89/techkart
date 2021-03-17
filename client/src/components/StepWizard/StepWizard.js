import React, {useState, useEffect} from 'react';
import { Steps } from 'antd';
import {useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';

import './StepWizard.css';

const StepWizard = () => {
    const { Step } = Steps;

    const [step, setStep] = useState(0);
    const location = useLocation();
    const {user} = useSelector(state => ({...state}));

    const getStepValue = () => {
        if(location.pathname === "/cart") setStep(0);
        if(user && location.pathname === "/checkout") setStep(1);
        if(user && location.pathname === "/payment") setStep(2);
    }

    useEffect(() => {
        getStepValue();
    }, [])

    return (
        <Steps className="site-navigation-steps" current={step} style={{maxWidth:'1300px', margin:'0 auto', padding:'30px 16px 15px 16px'}} type="navigation" size="small">
            <Step title="Cart"></Step>
            <Step title="Checkout"></Step>
            <Step title="Payment"></Step>
        </Steps>
    )
}

export default StepWizard;
