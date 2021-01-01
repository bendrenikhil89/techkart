import React, { useEffect } from 'react';
import { Drawer, Form, Input, Button, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const SubCategoryForm = ({setVisible, visible, createSubCategoryHandler, updateSubCategoryHandler, onChange, subCategory, setSubCategory, category, setCategory, categories, form}) => {
    const showDrawer = () => {
        if(subCategory.mode !== "edit"){
            setSubCategory({slug:'', name:'', mode:''});
            setCategory('');
        }
        setVisible(true);
    };

    const onClose = () => {
        setSubCategory({slug:'', name:'', mode:''});
        setCategory('');
        setVisible(false);
    }

    useEffect(() => {
        form.resetFields();
    }, [subCategory.mode])

    return (
        <>
            <Button type="primary" onClick={showDrawer}>
                <PlusOutlined /> New category
            </Button>
            <Drawer
                title="Create Category"
                width={window.innerWidth > 768 ? 650 : window.innerWidth - 75}
                placement="right"
                closable={true}
                onClose={onClose}
                visible={visible}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="Create Category"
                    scrollToFirstError
                >
                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: 'Please select category name!' }]}
                        initialValue={category}
                    >
                        <Select
                            onChange={onChange}
                            value={category}
                            allowClear
                        >
                            {categories.length > 0 &&
                            categories.map((c) => (
                                <Select.Option key={c._id} value={c._id}>
                                {c.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Sub Category"
                        name="subcategory"
                        rules={[{ required: true, message: 'Please input sub category name!' }]}
                        initialValue={subCategory.name}
                    >
                        <Input allowClear value={subCategory} onChange={e => setSubCategory({...subCategory, name:e.target.value})}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={subCategory.mode !== "edit" ? createSubCategoryHandler : updateSubCategoryHandler}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    )
}

export default SubCategoryForm;
