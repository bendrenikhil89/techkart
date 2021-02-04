import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { notification, Divider, Form, Input, Button, Checkbox } from 'antd';
import { ExclamationCircleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import {forgotPassword} from '../../../utils/auth-util';

const ForgotPassword = ({history}) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const forgotPasswordHandler = async(e) => {
        e.preventDefault();
        setLoading(true);
        try{
            await forgotPassword(email);
            openNotificationWithIcon('success', `Password reset email link sent to ${email}!`, '');
            history.push("/login");
        }
        catch(err){
            openNotificationWithIcon('error', 'Something went wrong', err.response.data.msg);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className="login-signup__container forgotpassword__container">
            {/* <form onSubmit={forgotPasswordHandler}>
                <h2>Password Reset</h2>
                <div className="login-signup__form-group">
                    <input type="text" required="required" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="input" className="login-signup__control-label">Your email</label><i className="login-signup__bar"></i>
                </div>
                <button type="submit" className="login-signup__button" >Send Reset Link</button>
                <Divider />
                <p className="login-signup__not-already-member">Remembered your password? <Link to="/login">Sign In</Link></p>
            </form> */}
            <h2>Reset Password</h2>
            <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            >
            <Form.Item
                name="username"
                rules={[{ required: true, message: "Please input your Username!" }]}
            >
                <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Item>

            <Form.Item>
                <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                block
                onClick={forgotPasswordHandler}
                loading={loading}
                >
                Send Reset Link
                </Button>
            </Form.Item>

            <Divider />

                <Form.Item>
                    <span style={{float:'right'}}>Remembered your password? <Link to="/login">Log In</Link></span>
                </Form.Item>
            </Form>
        </div>
    )
}

export default ForgotPassword;
