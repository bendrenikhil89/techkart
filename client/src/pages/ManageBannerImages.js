import React from 'react';
import AdminLeftNav from '../components/AdminDashboard/AdminLeftNav';
import '../components/AdminDashboard/AdminDashboard.css';
import { Divider } from 'antd';

const ManageBannerImages = () => {
    return (
        <div className="admin__wrapper">
            <div className="admin__leftnav">
                <AdminLeftNav />
            </div>
            <div className="admin__content">
                content
            </div>
        </div>
    )
}

export default ManageBannerImages;