import React from 'react';
import { Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import {Link, useLocation} from 'react-router-dom';


const AdminLeftNav = () => {
    const { SubMenu } = Menu;
    const location = useLocation();
    let selectedNav = location.pathname;
    if(selectedNav){
        selectedNav = selectedNav.split('/').slice(-1).pop();
    }
    
    return (
        <Menu
            className="admin__leftnav-component"
            defaultSelectedKeys={[selectedNav]}
            defaultOpenKeys={['admindashboard']}
            mode="inline"
            expandIcon={() => null}
        >
            <SubMenu key="admindashboard" icon={<SettingOutlined />} title="Admin Dashboard">
                <Menu.Item key="categories"><Link to="/dashboard/admin/categories">Categories</Link></Menu.Item>
                <Menu.Item key="subcategories"><Link to="/dashboard/admin/subcategories">Sub Categories</Link></Menu.Item>
                <Menu.Item key="products"><Link to="/dashboard/admin/products">Products</Link></Menu.Item>
                <Menu.Item key="bannerimages"><Link to="/dashboard/admin/bannerimages">Banner Images</Link></Menu.Item>
            </SubMenu>
      </Menu>
    )
}

export default AdminLeftNav
