import React, {useEffect, useState} from 'react';
import ImageGallery from 'react-image-gallery';
import './Styles/Dashboard.css';
import {fetchBannerImages} from '../utils/bannerImages-util';
import {fetchAll} from '../utils/categories-util';
import { fetchProductsByPageSize } from '../utils/product-util';
import {List, Card, notification, Empty} from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import ItemsCarousel from 'react-items-carousel';
import useWindowDimensions from '../Hooks/useWindowDimensions';
import Offer1 from '../assets/images/Offer1.jpg';
import Offer2 from '../assets/images/Offer2.jpg';
import Offer3 from '../assets/images/Offer3.jpg';
import Offer4 from '../assets/images/Offer4.jpg';
import ProductCard from '../components/Card/ProductCard/ProductCard';
import FooterCard from '../components/Card/FooterCard/FooterCard';

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [bannerImages, setBannerImages] = useState([]);
    const [categories, setCategories] = useState({slug:'', name:'', images: []});
    const [newArrivals, setNewArrivals] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);


    const [activeItemIndexNewArrivals, setActiveItemIndexNewArrivals] = useState(0);
    const [activeItemIndexBestSellers, setActiveItemIndexBestSellers] = useState(0);
    let itemCarouselCount = 1;

    const { width } = useWindowDimensions();
    if(width >= 1024){
        itemCarouselCount = 4;
    }
    else if(width >= 568 && width < 1024){
        itemCarouselCount = 2;
    }

    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const loadBannerImages = async() => {
        try{
            setLoading(true);
            let resBannerImages = await fetchBannerImages();
            setBannerImages(resBannerImages.data.length > 0 && resBannerImages.data.map(b => {
                return {original: b.url, thumbnail: ''}
            }));
            setLoading(false);
        }
        catch(err){
            setLoading(false);
            console.log('error',err.response.statusText, err.response.data);
        }
    }

    const fetchCategories = async() => {
        try{
            const categories = await fetchAll();
            setCategories(categories.data && categories.data.map(c => {
                return {slug: c.slug, name: c.name, images: c.images};
            }));
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const fetchProductsNewArrivals = async() => {
        try{
            let newArrivals = await fetchProductsByPageSize("updatedAt", "desc", 1, 8);
            setNewArrivals(newArrivals.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const fetchProductsBestSellers = async() => {
        try{
            let newArrivals = await fetchProductsByPageSize("sold", "desc", 1, 8);
            setBestSellers(newArrivals.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    useEffect(() => {
        loadBannerImages();
        fetchCategories();
        fetchProductsNewArrivals();
        fetchProductsBestSellers();
    }, []);

    return (
        <div className="dashboard__wrapper">
            <div className="dashboard__hero__wrapper">
                <ImageGallery 
                    items={bannerImages}
                    showThumbnails={false} 
                    showFullscreenButton={false} 
                    useBrowserFullscreen={false}
                    showPlayButton={false}
                    autoPlay={true}  
                    slideDuration={450}
                    slideInterval={3000}
                />
            </div>
            <div className="dashboard__content__wrapper">
                <h2>Shop By Category</h2>
                {categories.length > 0 
                ?<List
                        grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 4,
                        xl: 4,
                        xxl: 4
                        }}
                        dataSource={categories}
                        renderItem={item => (
                        <List.Item>
                            <Card
                                cover={
                                    item.images.length > 0 ? <img
                                        alt={item.title}
                                        src= {item.images[0].url} 
                                    /> : <img src="data:image/png;base64,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" 
                                        />
                                }
                                hoverable
                            >
                                <Card.Meta
                                    title={item.name}
                                    style={{textAlign:'center'}}
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
                            No categories found!
                        </span>
                        }
                    />}
                    <h2>New Arrivals</h2>
                    <div style={{"padding":0,"maxWidth":"1300px","margin":"0 auto"}}>
                        {newArrivals && newArrivals.length > 0 && <ItemsCarousel
                            numberOfCards={itemCarouselCount}
                            infiniteLoop={false}
                            gutter={16}
                            activePosition={'center'}
                            chevronWidth={60}
                            disableSwipe={false}
                            alwaysShowChevrons={false}
                            slidesToScroll={1}
                            outsideChevron={false}
                            showSlither={false}
                            firstAndLastGutter={false}
                            activeItemIndex={activeItemIndexNewArrivals}
                            requestToChangeActive={value => setActiveItemIndexNewArrivals(value)}
                            rightChevron={<button className="ant-btn ant-btn-circle">{<RightOutlined />}</button>}
                            leftChevron={<button className="ant-btn ant-btn-circle">{<LeftOutlined />}</button>}
                        >
                            {newArrivals.map(p=>{
                                return <ProductCard p={p} key={p._id}/>
                                })
                            }
                        </ItemsCarousel>}
                    </div>
                    {/* <div style={{marginTop:"40px"}}>
                        <ItemsCarousel
                                numberOfCards={3}
                                infiniteLoop={false}
                                gutter={4}
                                activePosition={'center'}
                                disableSwipe={false}
                                alwaysShowChevrons={false}
                                slidesToScroll={1}
                                outsideChevron={false}
                                showSlither={false}
                                firstAndLastGutter={false}
                                activeItemIndex={1}
                            >
                                <div
                                    style={{
                                    height: 200,
                                    background: `url(${Offer1})`,
                                    backgroundRepeat: 'round'
                                    }}
                                />
                                <div
                                    style={{
                                    height: 200,
                                    background: `url(${Offer2})`,
                                    backgroundRepeat: 'round'
                                    }}
                                />
                                <div
                                    style={{
                                    height: 200,
                                    background: `url(${Offer3})`,
                                    backgroundRepeat: 'round'
                                    }}
                                />
                            </ItemsCarousel>
                        </div>     */}

                    <h2>Best Sellers</h2>
                    <div style={{"padding":0,"maxWidth":"1300px","margin":"0 auto"}}>
                        {bestSellers && bestSellers.length > 0 && <ItemsCarousel
                            numberOfCards={itemCarouselCount}
                            infiniteLoop={false}
                            gutter={16}
                            activePosition={'center'}
                            chevronWidth={60}
                            disableSwipe={false}
                            alwaysShowChevrons={false}
                            slidesToScroll={1}
                            outsideChevron={false}
                            showSlither={false}
                            firstAndLastGutter={false}
                            activeItemIndex={activeItemIndexBestSellers}
                            requestToChangeActive={value => setActiveItemIndexBestSellers(value)}
                            rightChevron={<button className="ant-btn ant-btn-circle">{<RightOutlined />}</button>}
                            leftChevron={<button className="ant-btn ant-btn-circle">{<LeftOutlined />}</button>}
                        >
                            {bestSellers.map(p=>{
                                return <ProductCard p={p} key={p._id}/>
                                })
                            }
                        </ItemsCarousel>}
                    </div>
            </div>
            <FooterCard />
        </div>
    )
}

export default Dashboard;
