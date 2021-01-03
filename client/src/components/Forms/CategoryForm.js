import React, { useEffect } from 'react';
import { Drawer, Form, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FileUpload from '../FileUpload/FileUpload';

const CategoryForm = ({category, setCategory, setVisible, visible, createCategoryHandler, updateCategoryHandler, form, loading, setLoading, openNotificationWithIcon}) => {
    const showDrawer = () => {
        if(category.mode !== "edit") setCategory({slug:'', name:'', mode:'', images:[]})
        setVisible(true);
    };

    const onClose = () => {
        setCategory({slug:'', name:'', mode:'', images:[]});
        setVisible(false);
    }

    useEffect(() => {
        form.resetFields();
    }, [category.mode])

    return (
        <>
            <Button type="primary" onClick={showDrawer}>
                <PlusOutlined /> New category
            </Button>
            <Drawer
                title={category.mode !== "edit" ? "Create Category" : "Edit Category"}
                width={window.innerWidth > 768 ? 650 : window.innerWidth - 75}
                placement="right"
                closable={true}
                onClose={onClose}
                visible={visible}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name={category.mode !== "edit" ? "Create Category" : "Edit Category"}
                    scrollToFirstError
                >
                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: 'Please input category name!' }]}
                        initialValue={category.name}
                    >
                        <Input name="title" allowClear onChange={e => setCategory({...category, name: e.target.value})} />
                    </Form.Item>

                    <Form.Item
                        label="Images"
                        name="images"
                        
                    >
                        <FileUpload productDetails={category} 
                            setProductDetails={setCategory} 
                            openNotificationWithIcon={openNotificationWithIcon} 
                            loading={loading}
                            setLoading={setLoading}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" loading={loading} onClick={category.mode !== "edit" ? createCategoryHandler : updateCategoryHandler}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    )
}

export default CategoryForm
