import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Divider, notification } from 'antd';
import {forgotPassword} from '../../../utils/auth-util';

const ForgotPassword = ({history}) => {
    const [email, setEmail] = useState('');

    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const forgotPasswordHandler = async(e) => {
        e.preventDefault();
        try{
            await forgotPassword(email);
            openNotificationWithIcon('success', `Password reset email link sent to ${email}!`, '');
            history.push("/login");
        }
        catch(err){
            openNotificationWithIcon('error', 'Something went wrong', err.response.data.msg);
        }
    }

    return (
        <div className="login-signup__container forgotpassword__container">
            <form onSubmit={forgotPasswordHandler}>
                <h2>Password Reset</h2>
                <div className="login-signup__form-group">
                    <input type="text" required="required" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="input" className="login-signup__control-label">Your email</label><i className="login-signup__bar"></i>
                </div>
                <button type="submit" className="login-signup__button" >Send Reset Link</button>
                <Divider />
                <p className="login-signup__not-already-member">Already a member? <Link to="/login">Sign In</Link></p>
            </form>
        </div>
    )
}

export default ForgotPassword;
