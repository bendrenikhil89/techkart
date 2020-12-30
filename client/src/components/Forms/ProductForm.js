import React, { useEffect } from 'react';
import { Drawer, Form, Input, Select, InputNumber, Button, notification } from 'antd';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { createProduct, updateProduct } from '../../utils/product-util';
import { fetchLookupSubCategories } from '../../utils/subcategories-util';
import FileUpload from '../FileUpload/FileUpload';
var axios = require('axios');

const ProductForm = ({ productDetails, setProductDetails, openNotificationWithIcon, fetchProducts, setVisible, visible, initialState}) => {
    const [form] = Form.useForm();
    // const [visible, setVisible] = useState(false);
    
    const {user} = useSelector(state => ({...state}));
    const {email, authtoken} = user;
    
    const showDrawer = () => {
        setVisible(true);
    };

    const onSubmit = async() => {
        try{
            await form.validateFields();
            try{
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
                openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
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
            let subcategories =  await fetchLookupSubCategories(value);
            setProductDetails({...productDetails, subcategories: subcategories.data, category: value });
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    useEffect(() => form.resetFields(), [productDetails.mode]);

    return (
    <>
      <Button type="primary" onClick={showDrawer}>
          <PlusOutlined /> New product
      </Button>
      <Drawer
        title="Create Product"
        width={window.innerWidth > 768 ? 650 : window.innerWidth - 75}
        placement="right"
        closable={true}
        onClose={onClose}
        visible={visible}
      >
        <Form
            form={form}
            layout="vertical"
            name="Create Product"
            scrollToFirstError
        >
            <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Please input product title!' }]}
                initialValue={productDetails.title}
            >
                <Input name="title" onChange={onChangeHandler} />
            </Form.Item>

            <Form.Item
                label="Brand"
                name="brand"
                rules={[{ required: true, message: 'Please input product brand!' }]}
                initialValue={productDetails.brand}
            >
                <Input name="brand" onChange={onChangeHandler} />
            </Form.Item>

            <Form.Item
                label="Highlights"
                name="highlights"
                tooltip={{ title: 'Each highlight must be separated by ";#".', icon: <InfoCircleOutlined /> }}
                rules={[{ required: true, message: 'Please input product highlights!' }]}
                initialValue={productDetails.highlights}
            >
                <Input.TextArea name="highlights" onChange={onChangeHandler} />
            </Form.Item>

            <Form.Item
                label="Specifications"
                name="specifications"
                tooltip={{ title: 'Specifications should be a JSON wrapped in an array.', icon: <InfoCircleOutlined /> }}
                rules={[{ required: true, message: 'Please input product specifications!' }]}
                initialValue={productDetails.specifications}
            >
                <Input.TextArea name="specifications" onChange={onChangeHandler} />
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
                />
            </Form.Item>

            <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please select product category!' }]}
                initialValue={productDetails.mode === "edit" && productDetails.category}
            >
                <Select onChange={categoryChangeHandler}>
                    {productDetails.categories.length> 0 && productDetails.categories.map(c => (
                        <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Sub Category"
                name="subcategories"
                rules={[{ required: true, message: 'Please select product sub category!' }]}
                // initialValue={productDetails.mode === "edit" && productDetails.subcategories}
            >
                <Select mode="multiple" onChange={(e) => setProductDetails({...productDetails, subcategory: e})}>
                    {productDetails.subcategories.length> 0 && productDetails.subcategories.map(s => (
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
                />
            </Form.Item>

            <Form.Item
                label="Color"
                name="color"
                rules={[{ required: true, message: 'Please input product color!' }]}
                initialValue={productDetails.color}
            >
                <Input name="color" onChange={onChangeHandler} />
            </Form.Item>

            <Form.Item
                label="Shipping"
                name="shipping"
                rules={[{ required: true, message: 'Please select product shipping option!' }]}
                initialValue={productDetails.shipping}
            >
                <Select placeholder="Select shipping" onChange={(e) => setProductDetails({...productDetails, shipping: e})}>
                    <Select.Option value="Yes">Yes</Select.Option>
                    <Select.Option value="No">No</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Images"
                name="images"
                
            >
                <FileUpload productDetails={productDetails} setProductDetails={setProductDetails} openNotificationWithIcon={openNotificationWithIcon} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" onClick={onSubmit}>
                    Submit
                </Button>
            </Form.Item>
            </Form>
      </Drawer>
    </>
  )
}

export default ProductForm;
