import React from 'react';
import './FooterCard.css';
import { LockOutlined, VerifiedOutlined, CustomerServiceOutlined, MobileOutlined } from '@ant-design/icons';

const FooterCard = () => {
    return (
        <div className="footercard__container">
            <div className="footercard__wrapper">
                <LockOutlined className="footercard__icon" style={{color:'#f2825a'}}/>
                <h3>100% Secure Payments</h3>
                <p>Moving your card details to a much more secured place</p>
            </div>

            <div className="footercard__wrapper">
                <VerifiedOutlined className="footercard__icon" style={{color:'#67d1a4'}}/>
                <h3>TrustPay</h3>
                <p>100% Payment Protection. Easy  Return Policy</p>
            </div>

            <div className="footercard__wrapper">
                <CustomerServiceOutlined className="footercard__icon" style={{color:'#ffd581'}}/>
                <h3>Help Center</h3>
                <p>Got a question? Look no further. Browser our FAQs or submit your query here</p>
            </div>

            <div className="footercard__wrapper">
                <MobileOutlined className="footercard__icon" style={{color:'#1888bd'}}/>
                <h3>Shop on the go</h3>
                <p>Download the app and get exciting app only offers at your fingertips</p>
            </div>
        </div>
    )
}

export default FooterCard;
