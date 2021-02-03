import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import { Popover, Button, Divider, Input, Badge } from 'antd';
import { UserOutlined, ShoppingCartOutlined, HeartOutlined, FundOutlined, SearchOutlined, LogoutOutlined, DashboardOutlined } from '@ant-design/icons';
import {useHistory} from 'react-router-dom';

import './Navbar.css';

const Navbar = () => {
    const [searchText, setSearchText] = useState("");
    const { Search } = Input;
    const onSearch = value => console.log(value);
    const {user, search, cart} = useSelector(state => ({...state}));
    const {text} = search;
    const dispatch = useDispatch();
    const history = useHistory();

    const logoutHandler = (e) => {
        e.preventDefault();
        dispatch({
            type: 'LOG_OUT',
            payload: null
          });
        localStorage.removeItem("techkart-user");
    }

    const ordersLinkHandler = e => {
        e.preventDefault();
        history.push("/my/orders");
    }

    const loginContent = (
        <div className="navbar__signup-container">
          <div className="navbar__signup">
              <strong>New customer?</strong>
              <Link to="/signup">Sign Up</Link>
          </div>
          <Divider /> 
          {/* <Button type="text" icon={<UserOutlined />}>My Profile</Button>
          <Divider />
          <Button type="text" icon={<FundOutlined />}>Orders</Button> */}
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
                <Button type="text" icon={<FundOutlined />} onClick={ordersLinkHandler}>Orders</Button>
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

    const searchChangeHandler = e => {
        setSearchText(e.target.value)
        dispatch({
            type: 'SEARCH_QUERY',
            payload: {text : e.target.value}
        });
    }

    const searchHandler = async(e) => {
        e.preventDefault();
        history.push(`/shop`)
    }

    return (
        <div className="navbar__container">
            <nav className="navbar__nav">
                <div className="navbar__brand-wrapper">
                    <Link to="/" className="navbar__brand">TechKart</Link>
                    <Input placeholder="Search for products, brands and more" value={searchText} onChange={searchChangeHandler} suffix={<SearchOutlined onClick={searchHandler} />} className="navbar__search" />
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
                            <Link to="/cart">
                                <Badge count={cart && cart.length} size="default" offset={[0, 3]}>
                                    <div className="navbar__menu">
                                        <div className="navbar__menu__icon-wrapper"><ShoppingCartOutlined className="navbar__menu__icon" style={{fontSize: '1.2rem'}}/></div>
                                        <div style={{paddingTop: '3px'}} className="navbar__menu_text"><label>Cart</label></div>
                                    </div>
                                </Badge>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;
