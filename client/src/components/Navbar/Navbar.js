import React from 'react';
import { Link } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import { Popover, Button, Divider, Input, Badge } from 'antd';
import { UserOutlined, ShoppingCartOutlined, HeartOutlined, FundOutlined, SearchOutlined, LogoutOutlined, DashboardOutlined } from '@ant-design/icons';

import './Navbar.css';

const Navbar = () => {
    const { Search } = Input;
    const onSearch = value => console.log(value);
    const {user} = useSelector(state => ({...state}));
    const dispatch = useDispatch();

    const logoutHandler = (e) => {
        e.preventDefault();
        dispatch({
            type: 'LOG_OUT',
            payload: null
          });
        localStorage.removeItem("techkart-user");
    }

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
        let adminLink = null;
        if(user.role === 'admin') adminLink = (<><Button type="text" icon={<DashboardOutlined />}><Link to="/dashboard/admin/categories"><label style={{fontSize:'0.84rem', marginLeft:'8px', color:'#282c3f', cursor:'pointer'}}>Admin Dashboard</label></Link></Button>
        <Divider /></>);
        loggedInContent = (
            <div className="navbar__signup-container">
                <label className="navbar__username">Hello {user.name.split(' ')[0]}</label>
                <Divider /> 
                {adminLink}
                <Button type="text" icon={<UserOutlined />}>My Profile</Button>
                <Divider />
                <Button type="text" icon={<FundOutlined />}>Orders</Button>
                <Divider />
                <Button type="text" onClick={(e) => logoutHandler(e)} icon={<LogoutOutlined />}>Logout</Button>
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
