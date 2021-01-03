import React, {useEffect, useState} from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Switch, useHistory} from 'react-router-dom';
import Login from './components/Auth/Login/Login';
import SignUp from './components/Auth/SignUp/SignUp';
import Confirmation from './components/Auth/Confirmation/Confirmation';
import {validatetoken} from './utils/auth-util';
import {useDispatch, useSelector} from 'react-redux';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import AdminRoute from './components/Routes/AdminRoute';
import UserRoute from './components/Routes/UserRoute';
import ManageCategories from './pages/ManageCategories';
import ManageSubCategories from './pages/ManageSubCategories';
import ManageProducts from './pages/ManageProducts';
import ManageBannerImages from './pages/ManageBannerImages';
import PasswordReset from './components/Auth/PasswordReset/PasswordReset';
import ForgotPassword from './components/Auth/PasswordReset/ForgotPassword';
import Dashboard from './pages/Dashboard';
import { Footer } from 'antd/lib/layout/layout';
import SiteFooter from './components/SiteFooter/SiteFooter';
import ProductPage from './pages/ProductPage';

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();
  const {user} = useSelector(state => ({...state}));
  
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
      <Navbar />
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/forgotpassword" component={ForgotPassword} />
          <Route path="/resetpassword/:email/:token" exact component={PasswordReset} />
          <Route path="/confirmation/:email/:token" exact component={Confirmation} />
          <Route path="/" exact component={Dashboard} />
          <Route path="/product/:slug" exact component={ProductPage} />
          <AdminRoute path="/dashboard/admin/categories" exact component={ManageCategories} />
          <AdminRoute path="/dashboard/admin/subcategories" exact component={ManageSubCategories} />
          <AdminRoute path="/dashboard/admin/products" exact component={ManageProducts} />
          <AdminRoute path="/dashboard/admin/bannerimages" exact component={ManageBannerImages} />
        </Switch>
      </div>
      <SiteFooter /> 
    </> : <LoadingSpinner />)
  );
}

export default App;
