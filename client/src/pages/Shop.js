import React, {useState, useEffect} from 'react';
import { fetchProductsByPageSize, fetchFilteredProducts, fetchProductsByCategory } from '../utils/product-util';
import useWindowDimensions from '../Hooks/useWindowDimensions';
import {List, notification, Empty, Menu, Slider} from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import ProductCard from '../components/Card/ProductCard/ProductCard';
import './Styles/Shop.css';
import {useSelector} from 'react-redux';

const Shop = ({history}) => {
    const [pageLoadProducts, setPageLoadProducts] = useState([]);
    const [price, setPrice] = useState([0, 0]);
    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const {search} = useSelector(state => ({...state}));
    const {text, category} = search;

    const { SubMenu } = Menu;
    let typingTimer = null;
    let pageSizeCount = 9;

    const { width } = useWindowDimensions();
    if(width < 576){
        pageSizeCount = 1;
    }
    else if(width >= 576 && width <= 768){
        pageSizeCount = 8;
    }

    const fetchAllProductsOnLoad = async() => {
        try{
            let plProducts = await fetchProductsByPageSize("updatedAt", "desc", 1, pageSizeCount);
            setPageLoadProducts(plProducts.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const fetchAllProductsByCategory = async() => {
        try{
            let flProducts = await fetchProductsByCategory(category);
            setPageLoadProducts(flProducts.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const fetchFilteredProductsQuery = async() => {
        try{
            clearTimeout(typingTimer);
            typingTimer = setTimeout(async() => {
                if (text) {
                    let filteredProducts = await fetchFilteredProducts({query: text});
                    setPageLoadProducts(filteredProducts.data);
                }
            }, 500);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const priceSliderFilter = async() => {
        try{
            let filteredProducts = await fetchFilteredProducts({price});
            setPageLoadProducts(filteredProducts.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    useEffect(() => {
        if(category !== ""){
            fetchAllProductsByCategory();
        }
        else if(category === "" && text === ""){
            fetchAllProductsOnLoad();
        }
    }, []);

    useEffect(() => {
        if(text !== ""){
            fetchFilteredProductsQuery();
        }
        else if(category === "" && text === ""){
            fetchAllProductsOnLoad();
        }
        return () => clearTimeout(typingTimer);
    }, [text]);

    useEffect(() => {
        if(price)
            priceSliderFilter();
    }, [price]);

    function sliderToolTipFormatter(value) {
        return `$${value}`;
    }

    return (
        <div className="admin__wrapper">
            <div className="admin__leftnav">
                <Menu mode="inline" defaultOpenKeys={['price']}>
                    <SubMenu key="price" icon={<DollarOutlined />} title="Price" >
                        <Slider range max="4999" value={price} tipFormatter={sliderToolTipFormatter} onChange={value => setPrice(value)} style={{margin:'0px 20px'}}/>
                    </SubMenu>
                    <SubMenu key="sub1" icon={<DollarOutlined />} title="Category">
                        <Menu.Item key="1">Option 1</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub1" icon={<DollarOutlined />} title="Brand">
                        <Menu.Item key="1">Option 1</Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
            <div className="admin__content">
                {pageLoadProducts.length > 0 
                    ?<List
                        grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 3,
                        xl: 3,
                        xxl: 3
                        }}
                        dataSource={pageLoadProducts}
                        renderItem={item => (
                        <List.Item>
                            <ProductCard p={item} key={item._id}/>
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

export default Shop
