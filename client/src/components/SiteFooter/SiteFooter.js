import React from 'react';
import {useLocation} from 'react-router-dom';
import { FacebookFilled, InstagramFilled, YoutubeFilled } from '@ant-design/icons';
import './SiteFooter.css';

const SiteFooter = () => {
    const location = useLocation();
    let pathname = location.pathname.toString();
    pathname = pathname.split('/')[1];
    return (
        <>
        {pathname !== "login" && pathname !== "signup" &&  pathname !== "forgotpassword" &&  pathname !== "resetpassword"
        ? <div className="footer__wrapper">
            <div className="contain">
                <div className="col">
                    <h1>About</h1>
                    <ul>
                    <li>Contact Us</li>
                    <li>About Us</li>
                    <li>Careers</li>
                    <li>Techkart Stories</li>
                    <li>Press</li>
                    </ul>
                </div>
                <div className="col">
                    <h1>Help</h1>
                    <ul>
                    <li>Payments</li>
                    <li>Shipping</li>
                    <li>Cancellation & Returns</li>
                    <li>FAQ</li>
                    <li>Report Infringement</li>
                    </ul>
                </div>
                <div className="col">
                    <h1>Accounts</h1>
                    <ul>
                    <li>About</li>
                    <li>Mission</li>
                    <li>Services</li>
                    <li>Social</li>
                    <li>Get in touch</li>
                    </ul>
                </div>
                <div className="col">
                    <h1>Policy</h1>
                    <ul>
                    <li>Return Policy</li>
                    <li>Terms Of Use</li>
                    <li>Security</li>
                    <li>Privacy</li>
                    <li>Sitemap</li>
                    <li>ERP Compliance</li>
                    </ul>
                </div>
                <div className="col">
                    <h1>Support</h1>
                    <ul>
                    <li>Contact us</li>
                    <li>Web chat</li>
                    <li>Open ticket</li>
                    </ul>
                </div>
                <div className="col social">
                    <h1>Social</h1>
                    <ul>
                    <li><FacebookFilled style={{fontSize:'2rem', color:'#3a5794'}}/></li>
                    <li><InstagramFilled style={{fontSize:'2rem',color:'#c83278'}}/></li>
                    <li><YoutubeFilled style={{fontSize:'2rem',color:'#f70000'}}/></li>
                    </ul>
                </div>
            </div>
        </div> : null}
        </>
    )
}

export default SiteFooter;
