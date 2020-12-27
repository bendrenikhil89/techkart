import React, {useState,useEffect} from 'react';
import AdminLeftNav from '../components/AdminDashboard/AdminLeftNav';
import '../components/AdminDashboard/AdminDashboard.css';
import {Input, Button, List, Card, Divider, notification, Popconfirm, Modal, Select, Empty} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {fetchAll} from '../utils/categories-util';
import {fetchAllSubCategories, createSubCategory, removeSubCategory, updatesubCategory} from '../utils/subcategories-util';
import {useSelector} from 'react-redux';

const ManageSubCategories = () => {
    const [subCategory, setSubCategory] = useState('');
    const [subCategories, setSubCategories] = useState([]);
    const [updateSubCategory, setUpdateSubCategory] = useState({});

    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [updateCategory, setUpdateCategory] = useState(null);

    const {user} = useSelector(state => ({...state}));
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const { Option } = Select;
    const {email, authtoken} = user;
    
    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const createSubCategoryHandler = async(e) => {
        e.preventDefault();
        if(subCategory.length < 2) return openNotificationWithIcon('error','Sub Category Length Error', 'Please ensure that the sub category name has at least 2 characters');
        try{
            const newSubCategory = await createSubCategory({name: subCategory,parent: category}, email, authtoken);
            fetchSubCategories();
            setCategory(null);
            setSubCategory('');
            openNotificationWithIcon('success','Sub Category Created', `${newSubCategory.data.subCategory} created successfully!`)
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const updateSubCategoryHandler = async(e) => {
        e.preventDefault();
        if(updateSubCategory.name.length < 2) return openNotificationWithIcon('error','Sub Category Length Error', 'Please ensure that the sub category name has at least 2 characters');
        setConfirmLoading(true);
        try{
            const subCategory = await updatesubCategory({name: updateSubCategory.name, parent: updateCategory}, email, authtoken, updateSubCategory.slug);
            fetchSubCategories();
            setUpdateCategory('');
            setUpdateSubCategory({});
            openNotificationWithIcon('success','Sub Category Updated', `${subCategory.data.subCategory} updated successfully!`)
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
        setVisible(false);
        setConfirmLoading(false);
    }

    const fetchCategories = async() => {
        try{
            const categories = await fetchAll();
            setCategories(categories.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const fetchSubCategories = async() => {
        try{
            const subCategories = await fetchAllSubCategories();
            setSubCategories(subCategories.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const removeSubCategoryHandler = async(slug) => {
        try{
            const subCategory = await removeSubCategory(authtoken, slug, email);
            openNotificationWithIcon('success','Sub Category Deleted', `${subCategory.data.msg}!`)
            fetchSubCategories();
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const showModal = ({slug, name, parent}) => {
        setVisible(true);
        setUpdateSubCategory({...updateSubCategory, slug, name});
        setUpdateCategory(parent);
    };

    function onChange(value) {
        setCategory(value);
    }

    function onChangeUpdate(value) {
        setUpdateCategory(value);
    }
    
    const handleCancel = () => {
        setVisible(false);
    };

    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
    }, []);

    return (
        <>
        <div className="admin__wrapper">
            <div className="admin__leftnav">
                <AdminLeftNav />
            </div>
            <div className="admin__content">
                <Select
                    style={{ width: '100%' }}
                    onChange={onChange}
                    value={category}
                    placeholder="Select a category"
                    allowClear
                >
                    {categories.length > 0 &&
                    categories.map((c) => (
                        <Option key={c._id} value={c._id}>
                        {c.name}
                        </Option>
                    ))}
                </Select>
                <Input placeholder="Sub category name" style={{ marginTop: '20px' }} allowClear value={subCategory} onChange={e => setSubCategory(e.target.value)}/>
                <Button type="primary" size="medium" style={{marginTop: '20px'}} onClick={e => createSubCategoryHandler(e)}>Create</Button>
                <Divider />
                {subCategories.length > 0 
                ? <List
                    grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 4,
                    xl: 4,
                    xxl: 4,
                    }}
                    dataSource={subCategories}
                    renderItem={item => (
                    <List.Item>
                        <Card actions={[
                            <EditOutlined key="edit" onClick={() => showModal({slug: item.slug, name:item.name, parent: item.parent})} />,
                            <Popconfirm
                                title="Are you sure to delete this sub category?"
                                onConfirm={() => removeSubCategoryHandler(item.slug)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <DeleteOutlined key="ellipsis" />
                            </Popconfirm>,
                        ]}>{item.name}</Card>
                    </List.Item>
                    )}
                /> 
                : <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{
                    height: 60,
                    }}
                    description={
                    <span>
                        No sub categories found!
                    </span>
                    }
                />}
            </div>
        </div>
        <Modal
            title="Update Sub Category"
            visible={visible}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            centered
            footer={null}
        >
            <Select
                style={{ width: '100%' }}
                placeholder="Select a category"
                onChange={onChangeUpdate}
                value={updateCategory}
                allowClear
            >
                {categories.length > 0 &&
                categories.map((c) => (
                    <Option key={c._id} value={c._id}>
                        {c.name}
                    </Option>
                ))}
            </Select>
            <Input placeholder="Sub Category name" style={{marginTop: '20px'}} allowClear value={updateSubCategory.name} onChange={e => setUpdateSubCategory({...updateSubCategory, name: e.target.value})}/>
            <Button type="primary" size="medium" style={{marginTop: '20px'}} onClick={e => updateSubCategoryHandler(e)}>Update</Button>
        </Modal>
        </>
    )
}

export default ManageSubCategories;