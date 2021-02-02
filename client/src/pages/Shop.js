import React, {useState, useEffect} from 'react';
import { fetchProductsByPageSize, fetchFilteredProducts, fetchProductsByCategory } from '../utils/product-util';
import {fetchAllSubCategories} from '../utils/subcategories-util';
import {fetchAll} from '../utils/categories-util';
import useWindowDimensions from '../Hooks/useWindowDimensions';
import {List, notification, Empty, Menu, Slider, Checkbox, Radio, Pagination} from 'antd';
import { DollarOutlined, BarsOutlined, AntDesignOutlined, StarOutlined, StarFilled, TagsOutlined } from '@ant-design/icons';
import ProductCard from '../components/Card/ProductCard/ProductCard';
import './Styles/Shop.css';
import {useSelector, useDispatch} from 'react-redux';

const Shop = () => {
    const dispatch = useDispatch();
    const {search} = useSelector(state => ({...state}));
    const {text, category} = search;

    const [pageLoadProducts, setPageLoadProducts] = useState([]);
    const [price, setPrice] = useState([0, 0]);
    const [categories, setCategories] = useState({slug:'', name:'', images: [], id:''});
    const [subcategories, setSubcategories] = useState({slug:'', name:'', id:''});
    const [filterCategoryIDs, setFilterCategoryIDs] = useState(category);
    const [filterSubCategoryID, setFilterSubCategoryID] = useState(null);
    const [filterBrand, setFilterBrand] = useState(null);
    const [filterRating, setFilterRating] = useState(null);
    const [page, setPage] = useState(1);

    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };

    const { SubMenu } = Menu;
    let typingTimer = null;
    let pageSizeCount = 9;

    const { width } = useWindowDimensions();
    if(width < 576){
        pageSizeCount = 1;
    }
    else if(width >= 576 && width <= 768){
        pageSizeCount = 6;
    }

    const fetchAllProductsOnLoad = async() => {
        try{
            let plProducts = await fetchProductsByPageSize("updatedAt", "desc", page, pageSizeCount);
            setPageLoadProducts(plProducts.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const fetchAllProductsByCategory = async() => {
        try{
            let flProducts = await fetchProductsByCategory({category: filterCategoryIDs});
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
            setFilterBrand(null);
            setFilterSubCategoryID(null);
            setFilterCategoryIDs([]);
            setFilterRating(null);
            setPrice(price)
            let filteredProducts = await fetchFilteredProducts({price});
            setPageLoadProducts(filteredProducts.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const filterCategoryHandler = async(e) => {
        setPrice([0, 0]);
        setFilterBrand(null);
        setFilterSubCategoryID(null);
        setFilterRating(null);
        let categoryFilterInState = [...filterCategoryIDs];
        let categoryFilterInStateCheck = filterCategoryIDs.indexOf(e.target.value);
        if(categoryFilterInStateCheck === -1){
            categoryFilterInState.push(e.target.value);
        }
        else{
            categoryFilterInState.splice(categoryFilterInStateCheck, 1)
        }
        setFilterCategoryIDs(categoryFilterInState);
    }

    const starFilterHandler = async(rating) => {
        try{
            setPrice([0, 0]);
            setFilterBrand(null);
            setFilterCategoryIDs([]);
            setFilterSubCategoryID(null);
            setFilterRating(rating);
            let filteredProducts = await fetchFilteredProducts({rating});
            setPageLoadProducts(filteredProducts.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const brandFilterHandler = async(brand) => {
        try{
            setPrice([0, 0]);
            setFilterSubCategoryID(null);
            setFilterRating(null);
            setFilterCategoryIDs([]);
            setFilterBrand(brand);
            let filteredProducts = await fetchFilteredProducts({brand});
            setPageLoadProducts(filteredProducts.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const subcategoriesFilterHandler = async(subcategories) => {
        try{
            setPrice([0, 0]);
            setFilterBrand(null);
            setFilterRating(null);
            setFilterCategoryIDs([]);
            setFilterSubCategoryID(subcategories);
            let filteredProducts = await fetchFilteredProducts({subcategories});
            setPageLoadProducts(filteredProducts.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const fetchCategories = async() => {
        try{
            const allCategories = await fetchAll();
            setCategories(allCategories.data && allCategories.data.sort((a,b) => (a.name > b.name) ? 0 : -1).map(c => {
                return {slug: c.slug, name: c.name, images: c.images, id: c._id};
            }));
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const fetchSubCategories = async() => {
        try{
            const allSubCategories = await fetchAllSubCategories();
            setSubcategories(allSubCategories.data && allSubCategories.data.sort((a,b) => (a.name > b.name) ? 0 : -1).map(s => {
                return {slug: s.slug, name: s.name, id: s._id};
            }));
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
    }, []);

    useEffect(() => {
        fetchAllProductsOnLoad();
    }, [page])

    useEffect(() => {
        if(filterCategoryIDs.length > 0){
            fetchAllProductsByCategory();
        }
        else if(filterSubCategoryID === null && filterBrand === null && filterRating === null && price[0] === 0 && price[1] === 0){
            fetchAllProductsOnLoad();
        }
    }, [filterCategoryIDs]);

    useEffect(() => {
        if(text !== ""){
            fetchFilteredProductsQuery();
        }
        return () => clearTimeout(typingTimer);
    }, [text]);

    useEffect(() => {
        if(price[0] > 0 || price[1] > 0)
            priceSliderFilter();
    }, [price]);

    function sliderToolTipFormatter(value) {
        return `$${value}`;
    }

    const filterCategories = categories && categories.length > 0 && categories.map(c => {
        return <div key={c.id} style={{margin:'5px 0px 15px 25px'}}><Checkbox name="category" value={c.id} checked={filterCategoryIDs.includes(c.id)} onChange={filterCategoryHandler}>{c.name}</Checkbox><br/></div>
    });

    const filterSubCategories = subcategories && subcategories.length > 0 && subcategories.map((s,i) => {
        return <Radio key={s.id} style={radioStyle} value={s.id} onChange={() => subcategoriesFilterHandler(s.id)}>{s.name}</Radio>
    });

    return (
        <div className="admin__wrapper productspage__wrapper">
            <div className="admin__leftnav productspage__leftnav">
                <Menu mode="inline" defaultOpenKeys={['price', 'categories','subcategories', 'brand','rating']}>
                    <SubMenu key="price" icon={<DollarOutlined />} title="Price" >
                        <Slider range max="4999" value={price} tipFormatter={sliderToolTipFormatter} onChange={value => setPrice(value)} style={{margin:'0px 20px 10px 30px'}}/>
                    </SubMenu>
                    <SubMenu key="categories" icon={<BarsOutlined />} title="Category">
                        {filterCategories}
                    </SubMenu>
                    <SubMenu key="subcategories" icon={<TagsOutlined />} title="SubCategories">
                        <div style={{margin:'0px 0px 10px 25px'}}>
                            <Radio.Group value={filterSubCategoryID}>{filterSubCategories}</Radio.Group>
                        </div>
                    </SubMenu>
                    <SubMenu key="brand" icon={<AntDesignOutlined />} title="Brand">
                        <div style={{margin:'0px 0px 10px 25px'}}>
                        <Radio.Group value={filterBrand}>
                            <Radio style={radioStyle} value={"Acer"} onChange={() => brandFilterHandler("Acer")}>
                                Acer
                            </Radio>
                            <Radio style={radioStyle} value={"Apple"} onChange={() => brandFilterHandler("Apple")}>
                                Apple
                            </Radio>
                            <Radio style={radioStyle} value={"Asus"} onChange={() => brandFilterHandler("Asus")}>
                                Asus
                            </Radio>
                            <Radio style={radioStyle} value={"Huawei"} onChange={() => brandFilterHandler("Huawei")}>
                                Huawei
                            </Radio>
                        </Radio.Group>
                        </div>
                    </SubMenu>
                    <SubMenu key="rating" icon={<StarOutlined />} title="Rating">
                        <div style={{margin:'0px 0px 10px 25px'}}>
                            <div style={{margin:'0px 0px', cursor:'pointer'}} onClick={() => starFilterHandler(5)}><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><br /></div>
                            <div style={{margin:'10px 0px', cursor:'pointer'}} onClick={() => starFilterHandler(4)}><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><br /></div>
                            <div style={{margin:'10px 0px', cursor:'pointer'}} onClick={() => starFilterHandler(3)}><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><br /></div>
                            <div style={{margin:'10px 0px', cursor:'pointer'}} onClick={() => starFilterHandler(2)}><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><br /></div>
                            <div style={{margin:'10px 0px', cursor:'pointer'}} onClick={() => starFilterHandler(1)}><StarFilled style={{color:'#ffc107'}}/><br /></div>
                        </div>
                    </SubMenu>
                </Menu>
            </div>
            <div className="admin__content">
                {pageLoadProducts.length > 0 
                    ?<><List
                        grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 2,
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
                    <br />
                    {pageLoadProducts.length > pageSizeCount && <Pagination defaultCurrent={1} total={pageLoadProducts.length} pageSize={pageSizeCount} value={page} onChange={value => setPage(value)} />}
                    </>
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

export default Shop;