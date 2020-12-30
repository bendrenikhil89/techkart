import React, {useState, useEffect} from 'react';
import AdminLeftNav from '../components/AdminDashboard/AdminLeftNav';
import '../components/AdminDashboard/AdminDashboard.css';
import { Popconfirm, Empty, List, Divider, notification, Card, Carousel } from "antd";
import { UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ProductForm from '../components/Forms/ProductForm';
import { fetchAllProducts, removeProduct, fetchProduct } from '../utils/product-util';
import { fetchAll } from '../utils/categories-util';
import { useSelector } from "react-redux";

const initialState = {
    title:"",
    brand: "",
    highlights:"",
    specifications:[],
    price:"",
    category:"",
    categories:[],
    subcategories:[],
    quantity:"",
    sold:"",
    color:"",
    shipping:"",
    images: [],
    slug: "",
    mode:""
};

const ManageProducts = () => {
    const [loading, setLoading] = useState(false);
    const [productDetails, setProductDetails] = useState(initialState);
    const [products, setProducts] = useState([]);

    const [visible, setVisible] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));
    const { email, authtoken } = user;

    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const fetchCategories = async() => {
        try{
            const categories = await fetchAll();
            setProductDetails({...productDetails, categories: categories.data});
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const fetchProducts = async() => {
        try{
            let products = await fetchAllProducts();
            setProducts(products.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const handleProductRemove = async(slug) => {
        try{
            let removedProduct = await removeProduct(authtoken, slug, email);
            let filteredProducts = products.filter((item) => {
                return item.slug !== slug;
            });
            setProducts(filteredProducts);
            openNotificationWithIcon('success','Product Deleted', removedProduct.response.data.msg);
            fetchProducts();
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const editProduct = async(slug) => {
        try{
            let product = await fetchProduct(slug);
            setProductDetails({...productDetails, mode:"edit" ,...product.data[0]});
            setVisible(true);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    return (
        <div className="admin__wrapper">
            <div className="admin__leftnav">
                <AdminLeftNav />
            </div>
            <div className="admin__content">
                <ProductForm 
                    productDetails={productDetails} 
                    setProductDetails={setProductDetails} 
                    openNotificationWithIcon={openNotificationWithIcon} 
                    fetchProducts={fetchProducts} 
                    visible={visible}
                    setVisible={setVisible}
                    initialState={initialState}
                />
                <Divider />
                {products.length > 0 
                ?<List
                        grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 2,
                        xl: 3,
                        xxl: 3,
                        }}
                        dataSource={products}
                        renderItem={item => (
                        <List.Item>
                            <Card
                                cover={
                                    item.images.length > 0 ? <img
                                        alt={item.title}
                                        src= {item.images[0].url} 
                                    /> : null
                                }
                                actions={[
                                    <EditOutlined key="edit" onClick={() => editProduct(item.slug)} />,
                                    <Popconfirm
                                        title="Are you sure to delete this product?"
                                        onConfirm={() => handleProductRemove(item.slug)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <DeleteOutlined key="delete" />
                                    </Popconfirm>
                                ]}
                            >
                                <Card.Meta
                                    title={item.title}
                                />
                            </Card>
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
                            No products found!
                        </span>
                        }
                    />}
            </div>
        </div>
    )
}

export default ManageProducts;