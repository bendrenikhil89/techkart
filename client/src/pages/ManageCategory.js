import React, {useEffect, useState} from 'react';
import {Input, Button, List, Card, Divider, notification, Popconfirm, Modal, Empty} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AdminLeftNav from '../components/AdminDashboard/AdminLeftNav';
import {create, fetchAll, update, remove} from '../utils/categories-util';
import {useSelector} from 'react-redux';

const ManageCategory = () => {
    const [category, setCategory] = useState('');
    const [updateCategory, setUpdateCategory] = useState({});
    const [categories, setCategories] = useState([]);
    const {user} = useSelector(state => ({...state}));
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const {email, authtoken} = user;
    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const createCategoryHandler = async(e) => {
        e.preventDefault();
        if(category.length < 2) return openNotificationWithIcon('error','Category Length Error', 'Please ensure that the category name has at least 2 characters');
        try{
            const newCategory = await create(category, email, authtoken);
            fetchCategories();
            setCategory('');
            openNotificationWithIcon('success','Category Created', `${newCategory.data.category} created successfully!`)
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const updateCategoryHandler = async(e) => {
        e.preventDefault();
        if(updateCategory.length < 2) return openNotificationWithIcon('error','Category Length Error', 'Please ensure that the category name has at least 2 characters');
        setConfirmLoading(true);
        try{
            const category = await update(updateCategory.name, email, authtoken, updateCategory.slug);
            fetchCategories();
            setUpdateCategory({});
            openNotificationWithIcon('success','Category Updated', `${category.data.category} updated successfully!`)
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
            console.log(categories.data);
            setCategories(categories.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const removeCategoryHandler = async(slug) => {
        try{
            const category = await remove(authtoken, slug, email);
            openNotificationWithIcon('success','Category Deleted', `${category.data.msg}!`)
            fetchCategories();
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const showModal = ({slug, name}) => {
        setVisible(true);
        setUpdateCategory({...updateCategory, slug, name});
    };
    
    const handleCancel = () => {
        setVisible(false);
    };

    useEffect(() => {
        fetchCategories();
    }, [])
    return (
        <>
        <div className="admin__wrapper">
            <div className="admin__leftnav">
                <AdminLeftNav />
            </div>
            <div className="admin__content">
                <Input placeholder="Category name" allowClear value={category} onChange={e => setCategory(e.target.value)}/>
                    <Button type="primary" size="medium" style={{marginTop: '20px'}} onClick={e => createCategoryHandler(e)}>Create</Button>
                    <Divider />
                    {categories.length > 0 
                    ?<List
                        grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 4,
                        xl: 4,
                        xxl: 4,
                        }}
                        dataSource={categories}
                        renderItem={item => (
                        <List.Item>
                            <Card actions={[
                                <EditOutlined key="edit" onClick={() => showModal({slug: item.slug, name:item.name})} />,
                                <Popconfirm
                                    title="Are you sure to delete this category?"
                                    onConfirm={() => removeCategoryHandler(item.slug)}
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
                            No categories found!
                        </span>
                        }
                    />
                }
            </div>
        </div>
        <Modal
            title="Update Category"
            visible={visible}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            centered
            footer={null}
        >
            <Input placeholder="Category name" allowClear value={updateCategory.name} onChange={e => setUpdateCategory({...updateCategory, name: e.target.value})}/>
            <Button type="primary" size="medium" style={{marginTop: '20px'}} onClick={e => updateCategoryHandler(e)}>Update</Button>
        </Modal>
        </>
    )
}

export default ManageCategory;