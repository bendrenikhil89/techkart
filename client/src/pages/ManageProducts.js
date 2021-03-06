import React, {useState, useEffect} from 'react';
import LeftNav from '../components/LeftNav/LeftNav';
import '../components/AdminDashboard/AdminDashboard.css';
import { Popconfirm, Empty, Pagination, Divider, notification, Card, Skeleton } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ProductForm from '../components/Forms/ProductForm';
import { removeProduct, fetchProduct, fetchFilteredProducts, fetchProductsCount } from '../utils/product-util';
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
    allsubcategories: [],
    quantity:"",
    sold:"",
    color:"",
    shipping:"",
    images: [],
    slug: "",
    mode:""
};

const ManageProducts = () => {
    const [productDetails, setProductDetails] = useState(initialState);
    const [filter, setFilter] = useState({categoryID: []});
    const [products, setProducts] = useState([]);
    const [visible, setVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [productsCount, setProductsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    let pageSizeCount = 9;

    const { user } = useSelector((state) => ({ ...state }));
    const { email, authtoken } = user;

    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const links = [
        {to:"/dashboard/admin/categories", title:"Categories"},
        {to:"/dashboard/admin/subcategories", title:"Sub Categories"},
        {to:"/dashboard/admin/products", title:"Products"},
        {to:"/dashboard/admin/bannerimages", title:"Banner Images"},
        {to:"/dashboard/admin/orders", title:"Orders"},
    ];
    
    const fetchCategories = async() => {
        try{
            const categories = await fetchAll();
            setProductDetails({...productDetails, categories: categories.data});
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const fetchProductsCountPagination = async() => {
        try{
            let plProductsCount = await fetchProductsCount({query:""});
            setProductsCount(plProductsCount.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const fetchProducts = async() => {
        try{
            let products = await fetchFilteredProducts({query: "",filter, page, pageSizeCount});
            setProducts(products.data);
            setLoading(false);
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
            openNotificationWithIcon('success','Product Deleted', removedProduct.data.msg);
            fetchProducts();
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const editProduct = async(slug) => {
        try{
            let product = await fetchProduct(slug);
            setProductDetails({...productDetails, mode:"edit",...product.data});
            setVisible(true);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProductsCountPagination();
        fetchProducts();
    }, [page]);

    return (
        <div className="admin__wrapper">
            <div className="main__leftnav">
                <LeftNav links={links} title="Admin Dashboard" active="/dashboard/admin/products" />
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
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <div><p style={{fontWeight:'600'}}>Showing Products {(page-1)*pageSizeCount+1} - {productsCount >= page*pageSizeCount ? page*pageSizeCount : productsCount} of {productsCount} results</p></div>
                    <div>
                        <Pagination size="small" hideOnSinglePage={true} defaultCurrent={1} total={productsCount} pageSize={pageSizeCount} value={page} onChange={value => setPage(value)} />
                    </div>
                </div>
                {loading ? <Card><Skeleton/></Card>
                :<>
                {products.length > 0
                ?
                <div className="admin__productcard-wrapper">
                        {
                            products.map(item => { 
                                return <Card
                                    key={item._id}
                                    cover={
                                        item.images.length > 0 ? <img
                                            alt={item.title}
                                            src= {item.images[0].url} 
                                        /> : <img src="data:image/png;base64,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" 
                                            />
                                    }
                                    hoverable
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
                            })
                        }
                    </div>
                    : <><Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        imageStyle={{
                        height: 60,
                        }}
                        description={
                        <span>
                            No products found!
                        </span>
                        }
                    /></>
                 }</>}
            </div>
        </div>
    )
}

export default ManageProducts;