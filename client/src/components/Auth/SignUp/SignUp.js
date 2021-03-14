import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { notification, Modal, Form, Input, Button, Checkbox, Divider } from 'antd';
import { ExclamationCircleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
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
            <h2>Sign Up</h2>
            <Form
                name="normal_signup"
                className="signup-form"
                initialValues={{ remember: true }}
            >
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: "Please input your Name!" }]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Item>
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
                    onClick={signUpHandler}
                    loading={loading}
                    >
                    Sign Up
                    </Button>
                </Form.Item>
                <Divider />

                <Form.Item>
                    <span style={{float:'right'}}>Already a member? <Link to="/login">Log In</Link></span>
                </Form.Item>
            </Form>
        </div>
    )
}

export default SignUp;