import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Select, InputNumber, Button, notification } from 'antd';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { createProduct, updateProduct } from '../../utils/product-util';
import { fetchLookupSubCategories } from '../../utils/subcategories-util';
import FileUpload from '../FileUpload/FileUpload';

const ProductForm = ({ productDetails, setProductDetails, openNotificationWithIcon, fetchProducts, setVisible, visible, initialState}) => {
    const [form] = Form.useForm();
    
    const {user} = useSelector(state => ({...state}));
    const {email, authtoken} = user;

    const [loading, setLoading] = useState(false);
    
    const showDrawer = () => {
        setVisible(true);
    };

    const onSubmit = async() => {
        try{
            await form.validateFields();
            try{
                setLoading(true);
                if(productDetails.mode === "edit"){
                    let updatedProduct = await updateProduct(productDetails, email, authtoken, productDetails.slug);
                    openNotificationWithIcon('success','Product Updated', `${updatedProduct.data.title} updated successfully!`);
                    fetchProducts();
                    form.resetFields();
                    setVisible(false);
                }
                else{
                    let product = await createProduct(productDetails, email, authtoken);
                    openNotificationWithIcon('success','Product Created', `${product.data.title} created successfully!`);
                    fetchProducts();
                    form.resetFields();
                    setVisible(false);
                }
            }
            catch(err){
                setLoading(false);
                openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
            }
            finally{
                setLoading(false);
            }
            
        }
        catch(err){

        }
    }

    const onClose = () => {
        setProductDetails({...initialState, categories: productDetails.categories});
        setVisible(false);
    }

    const onChangeHandler = (e) => {
        setProductDetails({...productDetails, [e.target.name]: e.target.value})
    }

    const categoryChangeHandler = async(value) => {
        try{
            let allsubcategories =  await fetchLookupSubCategories(value);
            setProductDetails({...productDetails, allsubcategories: allsubcategories.data, category: value, subcategories : [] });
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const subCategoriesChangeHandler = (value) => {
        setProductDetails({...productDetails, subcategories: value });
    }

    useEffect(() => {
        if(productDetails.mode === "edit"){
            categoryChangeHandler(productDetails.category);
        }
        form.resetFields();
    }, [productDetails.mode])

    return (
    <>
      <Button type="primary" onClick={showDrawer}>
          <PlusOutlined /> New product
      </Button>
      <Drawer
        title={productDetails.mode !== "edit" ? "Create Product" : "Edit Product"}
        width={window.innerWidth > 768 ? 650 : window.innerWidth - 75}
        placement="right"
        closable={true}
        onClose={onClose}
        visible={visible}
      >
        <Form
            form={form}
            layout="vertical"
            name={productDetails.mode !== "edit" ? "Create Product" : "Edit Product"}
            scrollToFirstError
        >
            <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Please input product title!' }]}
                initialValue={productDetails.title}
            >
                <Input name="title" allowClear onChange={onChangeHandler} />
            </Form.Item>

            <Form.Item
                label="Brand"
                name="brand"
                rules={[{ required: true, message: 'Please input product brand!' }]}
                initialValue={productDetails.brand}
            >
                <Input name="brand" allowClear onChange={onChangeHandler} />
            </Form.Item>

            <Form.Item
                label="Highlights"
                name="highlights"
                tooltip={{ title: 'Each highlight must be separated by ";#".', icon: <InfoCircleOutlined /> }}
                rules={[{ required: true, message: 'Please input product highlights!' }]}
                initialValue={productDetails.highlights}
            >
                <Input.TextArea name="highlights" allowClear onChange={onChangeHandler} />
            </Form.Item>

            <Form.Item
                label="Specifications"
                name="specifications"
                tooltip={{ title: 'Specifications should be a JSON wrapped in an array.', icon: <InfoCircleOutlined /> }}
                rules={[{ required: true, message: 'Please input product specifications!' }]}
                initialValue={productDetails.specifications}
            >
                <Input.TextArea name="specifications" allowClear onChange={onChangeHandler} />
            </Form.Item>

            <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Please input product price!' }]}
                initialValue={productDetails.price}
            >
                <InputNumber
                    initialValues={0}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    onChange={(e) => setProductDetails({...productDetails, price: e})}
                    name="price"
                    style={{width:'100%'}}
                    allowClear
                />
            </Form.Item>

            <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please select product category!' }]}
                initialValue={productDetails.mode === "edit" && productDetails.category}
            >
                <Select onChange={categoryChangeHandler} allowClear>
                    {productDetails.categories.length> 0 && productDetails.categories.map(c => (
                        <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Sub Category"
                name="subcategories"
                rules={[{ required: true, message: 'Please select product sub category!' }]}
                initialValue={productDetails.mode === "edit" && productDetails.subcategories.length > 0 ? productDetails.subcategories : []}
            >
                <Select mode="multiple" onChange={subCategoriesChangeHandler} allowClear>
                    {productDetails.allsubcategories.length> 0 && productDetails.allsubcategories.map(s => (
                        <Select.Option key={s._id} value={s._id}>{s.name}</Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Please input availble product quantity!' }]}
                initialValue={productDetails.quantity}
            >
                <InputNumber
                    initialValues={0}
                    onChange={(e) => setProductDetails({...productDetails, quantity: e})}
                    name="quantity"
                    style={{width:'100%'}}
                    allowClear
                />
            </Form.Item>

            <Form.Item
                label="Sold"
                name="sold"
                rules={[{ required: true, message: 'Please input no of products sold!' }]}
                initialValue={productDetails.sold}
            >
                <InputNumber
                    initialValues={0}
                    onChange={(e) => setProductDetails({...productDetails, sold: e})}
                    name="sold"
                    style={{width:'100%'}}
                    allowClear
                />
            </Form.Item>

            <Form.Item
                label="Color"
                name="color"
                rules={[{ required: true, message: 'Please input product color!' }]}
                initialValue={productDetails.color}
            >
                <Input name="color" allowClear onChange={onChangeHandler} />
            </Form.Item>

            <Form.Item
                label="Shipping"
                name="shipping"
                rules={[{ required: true, message: 'Please select product shipping option!' }]}
                initialValue={productDetails.shipping}
            >
                <Select placeholder="Select shipping" onChange={(e) => setProductDetails({...productDetails, shipping: e})} allowClear>
                    <Select.Option value="Yes">Yes</Select.Option>
                    <Select.Option value="No">No</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Images"
                name="images"
                
            >
                <FileUpload productDetails={productDetails} 
                    setProductDetails={setProductDetails} 
                    openNotificationWithIcon={openNotificationWithIcon} 
                    loading={loading}
                    setLoading={setLoading}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" onClick={onSubmit} loading={loading}>
                    Submit
                </Button>
            </Form.Item>
            </Form>
      </Drawer>
    </>
  )
}

export default ProductForm;
