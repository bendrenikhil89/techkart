import React from 'react';
import { Link } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { Popover, Button, Divider, Input, Badge } from 'antd';
import { UserOutlined, ShoppingCartOutlined, HeartOutlined, FundOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons';

import './Navbar.css';

const Navbar = () => {
    const { Search } = Input;
    const onSearch = value => console.log(value);
    const {user} = useSelector(state => ({...state}));
    
    const loginContent = (
        <div className="navbar__signup-container">
          <div className="navbar__signup">
              <strong>New customer?</strong>
              <Link to="/signup">Sign Up</Link>
          </div>
          <Divider /> 
          <Button type="text" icon={<UserOutlined />}>My Profile</Button>
          <Divider />
          <Button type="text" icon={<FundOutlined />}>Orders</Button>
        </div>
    );
    
    let loggedInContent;
    if(user !== null){
        loggedInContent = (
            <div className="navbar__signup-container">
                <label className="navbar__username">Hello {user.name.split(' ')[0]}</label>
                <Divider /> 
                <Button type="text" icon={<UserOutlined />}>My Profile</Button>
                <Divider />
                <Button type="text" icon={<FundOutlined />}>Orders</Button>
                <Divider />
                <Button type="text" icon={<LogoutOutlined />}>Logout</Button>
            </div>
        );
    }

    const profileDiv = (
        <div className="navbar__menu">
            <div className="navbar__menu__icon-wrapper"><UserOutlined className="navbar__menu__icon"/></div>
            <div className="navbar__menu_text"><label>Profile</label></div>
        </div>
    );

    

    return (
        <div className="navbar__container">
            <nav className="navbar__nav">
                <div className="navbar__brand-wrapper">
                    <Link to="/" className="navbar__brand">TechKart
                        <Input placeholder="Search for products, brands and more" suffix={<SearchOutlined />} className="navbar__search" />
                    </Link>
                </div>
                <div className="navbar__links-wrapper">
                    <ul className="navbar__links">
                        <li>
                            {user === null ? <Popover content={loginContent} placement="bottom">
                                <Button type="secondary" shape="square" size="Medium">
                                    <Link to="/login">Login</Link>
                                </Button>
                                </Popover> : <Popover content={loggedInContent} placement="bottom">
                                    {profileDiv}
                                </Popover>}
                        </li>
                        <li>
                            <div className="navbar__menu">
                                <div className="navbar__menu__icon-wrapper"><HeartOutlined className="navbar__menu__icon" /></div>
                                <div className="navbar__menu_text"><label>Wishlist</label></div>
                            </div>
                        </li>
                        <li>
                            <Badge count={0} size="small">
                                <div className="navbar__menu">
                                    <div className="navbar__menu__icon-wrapper"><ShoppingCartOutlined className="navbar__menu__icon" style={{fontSize: '1.2rem'}}/></div>
                                    <div style={{paddingTop: '3px'}} className="navbar__menu_text"><label>Cart</label></div>
                                </div>
                            </Badge>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;
