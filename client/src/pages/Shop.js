import React, {useState, useEffect} from 'react';
import { fetchFilteredProducts, fetchProductsCount, fetchBrands } from '../utils/product-util';
import {fetchAllSubCategories} from '../utils/subcategories-util';
import {fetchAll} from '../utils/categories-util';
import {notification, Menu, Slider, Checkbox, Radio, Pagination, Button, Rate} from 'antd';
import { DollarOutlined, BarsOutlined, AntDesignOutlined, StarOutlined, StarFilled, TagsOutlined } from '@ant-design/icons';
import ProductCard from '../components/Card/ProductCard/ProductCard';
import {useSelector, useDispatch} from 'react-redux';
import notFound from '../assets/images/Not_Found.svg';

import './Styles/Shop.css';

const Shop = () => {
    const dispatch = useDispatch();
    const {search} = useSelector(state => ({...state}));
    const {text, category} = search;

    const [pageLoadProducts, setPageLoadProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState({slug:'', name:'', images: [], id:''});
    const [subcategories, setSubcategories] = useState({slug:'', name:'', id:''});
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState({categoryID: [...category] || []});
    const [productsCount, setProductsCount] = useState(0);

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

    const fetchBrandsForFilter = async() =>{
        try{
            const prodBrands = await fetchBrands();
            setBrands(prodBrands.data.sort());
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const fetchCurrProductsCount = async() => {
        let paramFilter = {query:text};
        try{
            if(filter && filter.constructor === Object && (Object.keys(filter).length > 1 || filter.categoryID.length > 0)){
                paramFilter = {...filter};
            }
            let plProductsCount = await fetchProductsCount(paramFilter);
            setProductsCount(plProductsCount.data);
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
                    let filteredProducts = await fetchFilteredProducts({query: text, page, pageSizeCount});
                    setPageLoadProducts(filteredProducts.data);
                    setFilter({categoryID:[]});
                }
            }, 500);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const fetchFilteredProductsByLeftNav = async() => {
        try{
            let filteredProducts = await fetchFilteredProducts({query: "", filter, page, pageSizeCount});
            setPageLoadProducts(filteredProducts.data);
            dispatch({
                type: 'SEARCH_QUERY',
                payload: {text: "",category : []}
            });
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

    function sliderToolTipFormatter(value) {
        return `$${value}`;
    }

    const filterCategories = categories && categories.length > 0 && categories.map(c => {
        return <div key={c.id} style={{margin:'5px 0px 15px 25px'}}>
            <Checkbox 
                name="category" 
                value={c.id} 
                checked={filter && filter.categoryID && filter.categoryID.includes(c.id)} 
                onChange={(e) => handleFilterChange("categoryID", e.target.value)}>
            {c.name}</Checkbox>
            <br/>
        </div>
    });

    const filterSubCategories = subcategories && subcategories.length > 0 && subcategories.map((s,i) => {
        return <Radio key={s.id} style={radioStyle} value={s.id} onChange={(e) => handleFilterChange("subcategoryID", s.id)}>{s.name}</Radio>
    });

    const filterBrands = brands && brands.length > 0 && brands.map((b,i) => {
        return <Radio key={i} style={radioStyle} value={b} onChange={() => handleFilterChange("brand",b)}>{b}</Radio>;
    });

    const handleFilterChange = (key, value) => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: {text: "",category : []}
        });
        if(key === "categoryID"){
            let categoryFilterInState = (filter.categoryID && [...filter.categoryID]) || [];
            let categoryFilterInStateCheck = filter.categoryID ? filter.categoryID.indexOf(value) : -1;
            if(categoryFilterInStateCheck === -1){
                categoryFilterInState.push(value);
            }
            else{
                categoryFilterInState.splice(categoryFilterInStateCheck, 1)
            }
            setFilter({...filter, [key]: categoryFilterInState});
        }
        else{
            setFilter({...filter, [key]: value});
        }
    }

    const handleClearFilter = e => {
        e.preventDefault();
        setFilter({categoryID:[]});
        dispatch({
            type: 'SEARCH_QUERY',
            payload: {text: "",category : []}
        });
    }

    const handleIndividualClearFilter = (e, key) => {
        e.preventDefault();
        let newFilter = {...filter};
        delete newFilter[key];
        setFilter(newFilter);
    }

    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
        fetchBrandsForFilter();
        fetchCurrProductsCount();
    }, []);

    useEffect(() => {
        if(text === ""){
            fetchFilteredProductsByLeftNav();
            fetchCurrProductsCount();
        }
    }, [page,filter,text]);

    useEffect(() => {
        if(text !== "") {
            fetchFilteredProductsQuery();
            fetchCurrProductsCount();
        }
    }, [text]);

    return (
        <div className="productspage__wrapper">
            <div className="productspage__leftnav">
            <Button type="primary" style={{background:'#1976d2'}} block onClick={handleClearFilter}>Clear Filter</Button>
                <Menu mode="inline" defaultOpenKeys={['price', 'categories','subcategories', 'brand','rating']}>
                    <SubMenu key="price" icon={<DollarOutlined />} title="Price" >
                        <Slider range max="4999" value={filter && filter.price ? filter.price : [0,0]} tipFormatter={sliderToolTipFormatter} onChange={value => handleFilterChange("price", value)} style={{margin:'0px 20px 10px 30px'}}/>
                    </SubMenu>
                    <SubMenu key="categories" icon={<BarsOutlined />} title="Category">
                        {filterCategories}
                    </SubMenu>
                    <SubMenu key="subcategories" icon={<TagsOutlined />} title="SubCategories">
                        {filter && filter.subcategoryID && <div style={{display:'flex', justifyContent:'flex-end', paddingRight:'8px'}}>
                            <Button size="small" type="link" onClick={(e) => handleIndividualClearFilter(e,"subcategoryID")}>Clear</Button>
                        </div>}
                        <div style={{margin:'0px 0px 10px 25px'}}>
                            <Radio.Group value={filter && (filter.subcategoryID || null)}>{filterSubCategories}</Radio.Group>
                        </div>
                    </SubMenu>
                    <SubMenu key="brand" icon={<AntDesignOutlined />} title="Brand">
                        {filter && filter.brand && <div style={{display:'flex', justifyContent:'flex-end', paddingRight:'8px'}}>
                            <Button size="small" type="link" onClick={(e) => handleIndividualClearFilter(e,"brand")}>Clear</Button>
                        </div>}
                        <div style={{margin:'0px 0px 10px 25px'}}>
                            <Radio.Group value={filter && filter.brand}>
                                {filterBrands}
                            </Radio.Group>
                        </div>
                    </SubMenu>
                    <SubMenu key="rating" icon={<StarOutlined />} title="Rating">
                        {filter && filter.rating && <div style={{display:'flex', justifyContent:'flex-end', paddingRight:'8px'}}>
                            <Button size="small" type="link" onClick={(e) => handleIndividualClearFilter(e,"rating")}>Clear</Button>
                        </div>}
                        <div style={{margin:'0px 0px 10px 25px'}}>
                            <div style={{margin:'0px 0px', cursor:'pointer'}} onClick={() => handleFilterChange("rating",5)}><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><br /></div>
                            <div style={{margin:'10px 0px', cursor:'pointer'}} onClick={() => handleFilterChange("rating",4)}><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><br /></div>
                            <div style={{margin:'10px 0px', cursor:'pointer'}} onClick={() => handleFilterChange("rating",3)}><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><br /></div>
                            <div style={{margin:'10px 0px', cursor:'pointer'}} onClick={() => handleFilterChange("rating",2)}><StarFilled style={{color:'#ffc107'}}/><StarFilled style={{color:'#ffc107'}}/><br /></div>
                            <div style={{margin:'10px 0px', cursor:'pointer'}} onClick={() => handleFilterChange("rating",1)}><StarFilled style={{color:'#ffc107'}}/><br /></div>
                        </div>
                    </SubMenu>
                </Menu>
            </div>
            <div className="shop__content">
                {pageLoadProducts.length > 0 
                    ?<>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <div><p style={{fontWeight:'600'}}>Showing Products {(page-1)*pageSizeCount+1} - {productsCount >= page*pageSizeCount ? page*pageSizeCount : productsCount} of {productsCount} results</p></div>
                        <div>
                            <Pagination size="small" hideOnSinglePage={true} defaultCurrent={1} total={productsCount} pageSize={pageSizeCount} value={page} onChange={value => setPage(value)} />
                        </div>
                    </div>
                    <div className="shop__productcard-wrapper">
                        {pageLoadProducts.map(p => { return <ProductCard p={p} key={p._id}/>})}
                    </div>
                    <br />
                    </>
                    :<>
                        <div><img src={notFound} style={{height:'30vh',width:'auto',display:'block',margin:'0 auto'}}/></div>
                        <div><p style={{display:'block',textAlign:'center', marginTop:'1.5rem', fontSize:'1rem'}}>No products found!</p></div>
                    </>
                    }
            </div>
        </div>
    )
}

export default Shop;