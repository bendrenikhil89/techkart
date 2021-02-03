import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import LeftNav from '../components/LeftNav/LeftNav';
import { Form, Input, Button, notification } from 'antd';
import { updatePassword } from '../utils/user-util';
import './Styles/UpdatePassword.css';

const UpdatePassword = () => {
    const [loading, setLoading] = useState(false);
    const [currPassword, setCurrPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const {user} = useSelector(state => ({...state}));
    let authtoken;
    let email;
    if(user){
        authtoken = user.authtoken;
        email = user.email;
    }

    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const links = [
        {to:"/my/profile", title:"Profile"},
        {to:"/my/passwordupdate", title:"Update Password"},
        {to:"/my/wishlist", title:"Wishlist"},
        {to:"/my/orders", title:"Orders"},
    ];

    const updatePasswordHandler = async(e) => {
        e.preventDefault();
        setLoading(true);
        if(newPassword !== confirmNewPassword){
            openNotificationWithIcon('error',"Password mismatch", "New password and confirm new password did not match. Please try again!");
            return;
        }
        try{
            const updatedUser = await updatePassword(email, authtoken, currPassword, newPassword);
            if(updatedUser.msg){
                openNotificationWithIcon('error',updatedUser.msg, "Current password entered is invalid");
                return;
            }
            else{   
                setCurrPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
                openNotificationWithIcon('success',"Password Updated", "Your password has been updated successfully!");
            }
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className="main__wrapper">
            <div className="main__leftnav">
                <LeftNav links={links} title="Account" active="/my/passwordupdate" />
            </div>
            <div className="main__content">
                <Form
                    className="passwordupdate__form"
                    layout="vertical"
                    name="Update Password"
                    scrollToFirstError
                >
                    <Form.Item
                        label="Current Password"
                        name="currentpassword"
                        rules={[{ required: true, message: 'Please input current password!' }]}
                        initialValue={currPassword}
                    >
                        <Input name="currentpassword" allowClear value={currPassword} onChange={(e) => setCurrPassword(e.target.value)} type="password" />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newpassword"
                        rules={[{ required: true, message: 'Please input new password!' }]}
                        initialValue={newPassword}
                    >
                        <Input name="newpassword" allowClear value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm New Password"
                        name="confirmnewpassword"
                        rules={[{ required: true, message: 'Please input confirm new password!' }]}
                        initialValue={confirmNewPassword}
                    >
                        <Input name="confirmnewpassword" allowClear value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} type="password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={updatePasswordHandler} loading={loading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default UpdatePassword;
