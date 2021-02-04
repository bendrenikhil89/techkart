import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import LeftNav from '../components/LeftNav/LeftNav';
import { Form, Input, Button, notification, Radio, DatePicker } from 'antd';
import { getCart, updateUserProfile } from '../utils/user-util';

const Profile = () => {
    const [userProfile, setUserProfile] = useState({name:'', email:'', mobile:'', gender:'', location:''});
    const [loading, setLoading] = useState(false);

    const {user} = useSelector(state => ({...state}));
    const {email, authtoken} = user;

    const [form] = Form.useForm();
    
    const links = [
        {to:"/my/profile", title:"Profile"},
        {to:"/my/passwordupdate", title:"Update Password"},
        {to:"/my/wishlist", title:"Wishlist"},
        {to:"/my/orders", title:"Orders"},
    ];

    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const getUserProfileDetails = async() => {
        try{
            setLoading(true);
            const user = await getCart(email, authtoken);
            let mobile, gender, location;
            user.data.mobile === undefined ? mobile = '' : mobile = user.data.mobile;
            user.data.gender === undefined ? gender = '' : gender = user.data.gender;
            user.data.location === undefined ? location = '' : location = user.data.location;
            setUserProfile({name: user.data.name, email: user.data.email, mobile, gender, location});
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
        finally{
            setLoading(false);
        }
    }

    const updateUserProfileHandler = async(e) => {
        e.preventDefault();
        try{
            const user = await updateUserProfile(email, authtoken, userProfile);
            let mobile, gender, location;
            user.data.mobile === undefined ? mobile = '' : mobile = user.data.mobile;
            user.data.gender === undefined ? gender = '' : gender = user.data.gender;
            user.data.location === undefined ? location = '' : location = user.data.location;
            setUserProfile({name: user.data.name, email: user.data.email, mobile, gender, location});
            openNotificationWithIcon('success','User profile updated successfully', '');
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    useEffect(() => {
        getUserProfileDetails();
    }, []);

    useEffect(() => {
        form.resetFields();
    }, [loading]);

    return (
        <div className="main__wrapper">
            <div className="main__leftnav">
                <LeftNav links={links} title="Account" active="/my/profile" />
            </div>
            <div className="main__content">
                <Form
                    className="passwordupdate__form"
                    layout="vertical"
                    name="Update Profile"
                    scrollToFirstError
                    form={form}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                        initialValue={userProfile.name}
                    >
                        <Input name="name" value={userProfile.name} allowClear onChange={(e) => setUserProfile({...userProfile,[e.target.name]:e.target.value})} />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        initialValue={userProfile.email}
                    >
                        <Input name="email" allowClear value={userProfile.email} disabled />
                    </Form.Item>

                    <Form.Item
                        label="Mobile"
                        name="mobile"
                        initialValue={userProfile.mobile}
                    >
                        <Input name="mobile" allowClear value={userProfile.mobile} onChange={(e) => setUserProfile({...userProfile,[e.target.name]:e.target.value})} />
                    </Form.Item>

                    <Form.Item
                        label="Gender"
                        name="gender"
                        initialValue={userProfile.gender}
                    >
                        <Radio.Group name="gender" onChange={(e) => setUserProfile({...userProfile,[e.target.name]:e.target.value})}>
                            <Radio.Button value="Male">Male</Radio.Button>
                            <Radio.Button value="Female">Female</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="Location"
                        name="location"
                        initialValue={userProfile.location}
                    >
                        <Input name="location" allowClear value={userProfile.location} onChange={(e) => setUserProfile({...userProfile,[e.target.name]:e.target.value})} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={updateUserProfileHandler} loading={loading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Profile;
