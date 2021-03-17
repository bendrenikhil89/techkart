import React, {useEffect} from 'react';
import {confirmation, resendlink} from '../../../utils/auth-util';
import { notification, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const Confirmation = ({history, match}) => {
    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const verifyEmail = async() => {
        try{
            await confirmation(match.params.email, match.params.token);
            openNotificationWithIcon('success', 'Email verification successful', 'Your email address has been verified succesfully.');
            history.push("/");
        }
        catch(err){
            if(err.response.status === 400){
                showConfirm(`${err.response.data.msg} Do you want to resend email verification link?`);
            }
            else{
                openNotificationWithIcon('error', 'Email verification failed', err.response.data.msg);
                history.push("/login");
            }
        }
    }

    const showConfirm = (content) => {
        confirm({
          title: 'Email verification failed',
          icon: <ExclamationCircleOutlined />,
          content: content,
          centered: true,
          async onOk() {
            try{
                await resendlink(match.params.email);
                openNotificationWithIcon('success','Email verification link resent', 'Email verification link has been sent to your email.');
                history.push("/login");
            }
            catch(err){
                openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
                history.push('/login');
            }
          },
          onCancel() {
            history.push('/login');
          },
        });
      }

    useEffect(() => {
        verifyEmail();
    }, []);
    return (
        <>
        </>
    )
}

export default Confirmation;
