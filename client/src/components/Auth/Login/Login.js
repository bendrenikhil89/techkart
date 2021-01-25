import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Divider, notification, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {login, resendlink} from '../../../utils/auth-util';
import {useDispatch, useSelector} from 'react-redux';

import '../../Auth/Auth.css';
const { confirm } = Modal;

const Login = ({history}) => {
    const dispatch = useDispatch();
    const {user} = useSelector(state => ({...state}));
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const roleBasedRedirect = (role) => {
        if(history.location.state){
            history.push(history.location.state.source);
        }
        else if(role === 'admin'){
            history.push("/dashboard/admin/categories");
        }
        else{
            history.push("/")
        }
    }

    const showConfirm = (content) => {
        confirm({
          title: 'Email verification failed',
          icon: <ExclamationCircleOutlined />,
          content: content,
          centered: true,
          async onOk() {
            let res;
            try{
                res = await resendlink(email);
                openNotificationWithIcon('success','Email verification link resent', 'Email verification link has been sent to your email.');
                history.push("/login");
            }
            catch(err){
                setLoading(false);
                openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
            }
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }
    
    const loginHandler = async(e) => {
        e.preventDefault();
        setLoading(true);
        let res;
        try{
            res = await login(email, password);
            // openNotificationWithIcon('success',res.data.name, res.data.token);
            localStorage.setItem("techkart-user", JSON.stringify({name: res.data.name, email: res.data.email, authtoken: res.data.token, role: res.data.role, _id: res.data.userId}))
            dispatch({
                type: 'LOGGED_IN',
                payload: {
                  name: res.data.name,
                  email: res.data.email,
                  authtoken: res.data.token,
                  role: res.data.role,
                  _id: res.data.userId
                }
            });
            roleBasedRedirect(res.data.role);
            // res.data.role === 'admin' ? history.push("/dashboard/admin/categories") : history.push("/");
        }
        catch(err){
            setLoading(false);
            if(err.response.data.msg === "Your Email has not been verified."){
                showConfirm(`${err.response.data.msg} Do you want to resend email verification link?`);
            }
            else{
                openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
            }
        }
    }

    useEffect(() => {
        if(user && user.authtoken && (history.location.pathname === "/login" || history.location.pathname === "/login/")){
            history.push("/");
        }
    }, [user]);
    return (
        <div className="login-signup__container">
            <form onSubmit={loginHandler}>
                <h2>Sign In</h2>
                <div className="login-signup__form-group">
                    <input type="text" required="required" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="input" className="login-signup__control-label">Your email</label><i className="login-signup__bar"></i>
                </div>
                <div className="login-signup__form-group">
                    <input type="password" required="required" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label htmlFor="input" className="login-signup__control-label">Your password</label><i className="login-signup__bar"></i>
                </div>
                <p className="login__forgot-password"><Link to="/forgotpassword">Forgot Password?</Link></p>
                <button type="submit" className="login-signup__button" >Sign In</button>
                <Divider />
                <p className="login-signup__not-already-member">Not a member? <Link to="/signup">Sign Up</Link></p>
            </form>
        </div>
    )
}

export default Login;
