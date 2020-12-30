import React, {useState, useEffect} from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Popconfirm, Empty, List, Divider, notification, Upload, Card, Button } from "antd";
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLeftNav from '../components/AdminDashboard/AdminLeftNav';
import '../components/AdminDashboard/AdminDashboard.css';
import {uploadBannerImage, removeBannerImage, fetchBannerImages} from '../utils/bannerImages-util';

const ManageBannerImages = () => {
    const { user } = useSelector((state) => ({ ...state }));
    const {email, authtoken} = user;
    const [loading, setLoading] = useState(false);
    const [bannerImages, setBannerImages] = useState([]);

    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const loadBannerImages = async() => {
        try{
            let bannerImages = await fetchBannerImages();
            setBannerImages(bannerImages.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data);
        }
    }

    const fileUploadAndResize = (e) => {
        let file = e.target.files[0];
        if (file) {
            setLoading(true);
            Resizer.imageFileResizer(file, 1920, 1080, "JPEG", 100, 0, (uri) => {
                axios.post(`${process.env.REACT_APP_API_URL}/uploadimages`, { image: uri , email}, {
                      headers: {
                        authtoken
                      },
                    }
                )
                .then(async(res) => {
                    try{
                        let uploadedImage = await uploadBannerImage(res.data, authtoken, email);
                        loadBannerImages();
                        openNotificationWithIcon('success', 'Upload Successful', uploadedImage.data.msg);
                    }
                    catch(err){
                        openNotificationWithIcon('error',err.response.statusText, err.response.data);
                    }
                    setLoading(false);
                    setBannerImages([ ...bannerImages, {url : res.data.url, public_id: res.data.public_id} ]);
                  })
                .catch((err) => {
                    setLoading(false);
                    openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
                });
            },
              "base64"
            );
        }
    };

    const handleBannerImageRemove = (public_id) => {
        setLoading(true);
        axios.post(`${process.env.REACT_APP_API_URL}/removeimage`,{ public_id, authtoken, email }, {
            headers: {
                authtoken
            },
        })
        .then(async(res) => {
            try{
                let deletedImage = await removeBannerImage(public_id, authtoken, email);
                let filteredImages = bannerImages.filter((item) => {
                    return item.public_id !== public_id;
                });
                setLoading(false);
                setBannerImages(filteredImages);
                loadBannerImages();
                openNotificationWithIcon('success', 'Removal Successful', deletedImage.data.msg);
            }
            catch(err){
                openNotificationWithIcon('error',err.response.statusText, err.response.data);
                setLoading(false);
            }
        })
        .catch((err) => {
            setLoading(false);
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        });
    }

    useEffect(() => {
        loadBannerImages();
    }, [])

    return (
        <div className="admin__wrapper">
            <div className="admin__leftnav">
                <AdminLeftNav />
            </div>
            <div className="admin__content">
                {!loading ? <label className="admin__uploadbanner">
                    {<UploadOutlined style={{marginRight:'8px'}}/>}Choose File
                    <input
                        type="file"
                        hidden
                        accept="images/*"
                        onChange={fileUploadAndResize}
                    />
                </label> : <Button type="primary" loading>Working on it</Button> }
                <Divider />
                {bannerImages.length > 0 
                ?<List
                        grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 1,
                        lg: 2,
                        xl: 2,
                        xxl: 2,
                        }}
                        dataSource={bannerImages}
                        renderItem={item => (
                        <List.Item>
                            <Card
                                hoverable
                                bodyStyle={{ padding: "0"}}
                                cover={
                                    <img
                                        alt=""
                                        src={item.url}
                                        style={{objectFit:'contain', display:'block', height:'auto'}}
                                    />
                                }
                                actions={[
                                    <Popconfirm
                                        title="Are you sure to delete this image?"
                                        onConfirm={() => handleBannerImageRemove(item.public_id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <DeleteOutlined key="delete" />
                                    </Popconfirm>
                                ]}
                            >
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
                            No banner images found!
                        </span>
                        }
                    />}
            </div>
        </div>
    )
}

export default ManageBannerImages;