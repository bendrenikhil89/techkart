import React, {useEffect, useState} from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Switch, useHistory} from 'react-router-dom';
import Login from './components/Auth/Login/Login';
import SignUp from './components/Auth/SignUp/SignUp';
import Confirmation from './components/Auth/Confirmation/Confirmation';
import {validatetoken} from './utils/auth-util';
import {useDispatch} from 'react-redux';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import AdminRoute from './components/Routes/AdminRoute';
import UserRoute from './components/Routes/UserRoute';
import PasswordReset from './components/Auth/PasswordReset/PasswordReset';
import ForgotPassword from './components/Auth/PasswordReset/ForgotPassword';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import SiteFooter from './components/SiteFooter/SiteFooter';
import ManageCategories from './pages/ManageCategories';
import ManageSubCategories from './pages/ManageSubCategories';
import ManageProducts from './pages/ManageProducts';
import ManageBannerImages from './pages/ManageBannerImages';
import Dashboard from './pages/Dashboard';
import ProductPage from './pages/ProductPage';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import CartDrawer from './components/CartDrawer/CartDrawer';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Orders from './pages/Orders';
import UpdatePassword from './pages/UpdatePassword';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import ManageOrders from './pages/ManageOrders';

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();
  
  const persistUser = async() => {
    const user = JSON.parse(localStorage.getItem("techkart-user"));
    if(user){
      const {name, email, authtoken, _id, role} = user;
      let res;
      try{
        res = await validatetoken(authtoken);
        let objExpiresAt = JSON.parse('{"date_created": "'+res.data.exp+'"}');
        const expiresAt = new Date(1000*objExpiresAt.date_created);
        const currDate = new Date();

        if(expiresAt > currDate){
          localStorage.setItem("techkart-user", JSON.stringify({name, email, authtoken, role, _id, expiresAt: res.data.exp}))
          dispatch({
            type: 'PERSIST_LOGIN',
            payload: {
              name,
              email,
              authtoken,
              role,
              _id,
              expiresAt: res.data.exp
            }
          });
        }
        else{
          localStorage.removeItem("techkart-user");
          dispatch({
            type: 'LOG_OUT',
            payload: null
          });
          history.push("/login");
        }
        setLoading(false);
      }
      catch(err){
        setLoading(false);
        localStorage.removeItem("techkart-user");
        history.push("/login");
      }
    }
    else{
      setLoading(false);
    }
  }

  useEffect(() => {
    persistUser();
  }, []);

  return (
    (!loading ?
      <> 
      <div className="app__wrapper">
      <CartDrawer />
      <ScrollToTop />
      <Navbar />
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/forgotpassword" component={ForgotPassword} />
          <Route path="/resetpassword/:email/:token" exact component={PasswordReset} />
          <Route path="/confirmation/:email/:token" exact component={Confirmation} />
          <Route path="/" exact component={Dashboard} />
          <Route path="/product/:slug" exact component={ProductPage} />
          <Route path="/shop" exact component={Shop} />
          <Route path="/cart" exact component={Cart} />
          <UserRoute path="/checkout" exact component={Checkout} />
          <UserRoute path="/payment" exact component={Payment} />
          <UserRoute path="/my/orders" exact component={Orders} />
          <UserRoute path="/my/passwordupdate" exact component={UpdatePassword} />
          <UserRoute path="/my/wishlist" exact component={Wishlist} />
          <UserRoute path="/my/profile" exact component={Profile} />
          <AdminRoute path="/dashboard/admin/categories" exact component={ManageCategories} />
          <AdminRoute path="/dashboard/admin/subcategories" exact component={ManageSubCategories} />
          <AdminRoute path="/dashboard/admin/products" exact component={ManageProducts} />
          <AdminRoute path="/dashboard/admin/bannerimages" exact component={ManageBannerImages} />
          <AdminRoute path="/dashboard/admin/orders" exact component={ManageOrders} />
        </Switch>
      </div>
      <SiteFooter /> 
    </> : <LoadingSpinner />)
  );
}

export default App;
