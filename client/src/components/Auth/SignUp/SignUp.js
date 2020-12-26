import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Divider, notification } from 'antd';
import {signUp} from '../../../utils/auth-util';

const SignUp = ({history}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    
    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };
    
    const signUpHandler = async(e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            openNotificationWithIcon('error',"Password mismatch", "Password and confirm password do not match.");
            setLoading(false);
            return;
        }
        setLoading(true);
        let res;
        try{
            res = await signUp(name, email, password);
            openNotificationWithIcon('success',res.data.statusText, res.data);
            history.push("/login");
        }
        catch(err){
            setLoading(false);
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    return (
        <div className="login-signup__container signup__container">
            <form onSubmit={signUpHandler}>
                <h1>Sign Up</h1>
                <div className="login-signup__form-group">
                    <input type="text" required="required" value={name} onChange={(e) => setName(e.target.value)}/>
                    <label htmlFor="input" className="login-signup__control-label">Your name</label><i className="login-signup__bar"></i>
                </div>
                <div className="login-signup__form-group">
                    <input type="text" required="required" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="input" className="login-signup__control-label">Your email</label><i className="login-signup__bar"></i>
                </div>
                <div className="login-signup__form-group">
                    <input type="password" required="required" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label htmlFor="input" className="login-signup__control-label">Your password</label><i className="login-signup__bar"></i>
                </div>
                <div className="login-signup__form-group">
                    <input type="password" required="required" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    <label htmlFor="input" className="login-signup__control-label">Confirm password</label><i className="login-signup__bar"></i>
                </div>
                <button type="submit" className="login-signup__button">Sign Up</button>
                <Divider />
                <p className="login-signup__not-already-member">Already a member? <Link to="/login">Sign In</Link></p>
            </form>
        </div>
    )
}

export default SignUp;