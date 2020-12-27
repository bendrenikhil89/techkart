import React, {useState} from 'react';
import AdminLeftNav from '../components/AdminDashboard/AdminLeftNav';
import '../components/AdminDashboard/AdminDashboard.css';
import { Input,Button,Divider } from 'antd';

const ManageSubCategories = () => {
    const [subcategory, getSubCategory] = useState('');

    const createSubCategoryHandler = async(e) => {

    }

    return (
        <div className="admin__wrapper">
            <div className="admin__leftnav">
                <AdminLeftNav />
            </div>
            <div className="admin__content">
                <Input placeholder="Sub category name" allowClear value={subcategory} onChange={e => getSubCategory(e.target.value)}/>
                <Button type="primary" size="medium" style={{marginTop: '20px'}} onClick={e => createSubCategoryHandler(e)}>Create</Button>
                <Divider />
            </div>
        </div>
    )
}

export default ManageSubCategories;
