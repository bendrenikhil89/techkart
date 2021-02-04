import React, {useState} from 'react';
import { notification, Divider, Form, Input, Button, Checkbox } from 'antd';
import { ExclamationCircleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import {resetPassword} from '../../../utils/auth-util';

const PasswordReset = ({history, match}) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const resetPasswordHandler = async(e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            openNotificationWithIcon('error',"Password mismatch", "Password and confirm password do not match.");
            setLoading(false);
            return;
        }
        try{
            setLoading(true);
            await resetPassword(match.params.email, match.params.token, password);
            openNotificationWithIcon('success', `Password updated successfully. Please LogIn!`, '');
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
        <div className="login-signup__container passwordreset__container">
            {/* <form onSubmit={resetPasswordHandler}>
                <h2>Password Reset</h2>
                <div className="login-signup__form-group">
                    <input type="password" required="required" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label htmlFor="input" className="login-signup__control-label">New password</label><i className="login-signup__bar"></i>
                </div>
                <div className="login-signup__form-group">
                    <input type="password" required="required" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    <label htmlFor="input" className="login-signup__control-label">Confirm password</label><i className="login-signup__bar"></i>
                </div>
                <button type="submit" className="login-signup__button" >Update Password</button>
            </form> */}
            <h2>Reset Password</h2>
            <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            >
            <Form.Item
                name="password"
                rules={[{ required: true, message: "Please input your Password!" }]}
            >
                <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Item>
            <Form.Item
                    name="confirmpassword"
                    rules={[{ required: true, message: "Please input your Confirm Password!" }]}
                >
                    <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
            </Form.Item>

            <Form.Item>
                <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                block
                onClick={resetPasswordHandler}
                loading={loading}
                >
                    Update Password
                </Button>
            </Form.Item>
            </Form>
        </div>
    )
}

export default PasswordReset
