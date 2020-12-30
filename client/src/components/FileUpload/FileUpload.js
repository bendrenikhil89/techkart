import React, { useState } from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Button, Badge, Image, Divider, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const FileUpload = ({ productDetails, setProductDetails, openNotificationWithIcon }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const { email, authtoken } = user;
  const [loading, setLoading] = useState(false);
  let allProductImages = [...productDetails.images];

  const productImageUploadAndResize = (e) => {
    let files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        setLoading(true);
        Resizer.imageFileResizer(files[i], 720, 720, "JPEG", 100, 0, (uri) => {
            axios.post(`${process.env.REACT_APP_API_URL}/uploadimages`, { image: uri , email}, {
                  headers: {
                    authtoken
                  },
                }
            )
            .then((res) => {
                try{
                    // let allProductImages = [...productDetails.images];
                    allProductImages.push(res.data);
                    setProductDetails({ ...productDetails, images: allProductImages });
                    setLoading(false);
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
        },
          "base64"
        );
      }
    }
};

const handleProductImageRemove = (public_id) => {
  setLoading(true);
  axios.post(`${process.env.REACT_APP_API_URL}/removeimage`,{ public_id, authtoken, email }, {
      headers: {
          authtoken
      },
  })
  .then((res) => {
      try{
          // let allProductImages = [...productDetails.images];
          let filteredImages = allProductImages.filter((item) => {
              return item.public_id !== public_id;
          });
          setProductDetails({ ...productDetails, images: filteredImages });
          setLoading(false);
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

  return (
    <>
      {!loading ? (
        <label className="admin__uploadbanner">
          {<UploadOutlined style={{ marginRight: "8px" }} />}Choose File
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={productImageUploadAndResize}
          />
        </label>
      ) : (
        <Button type="primary" loading>
          Working on it
        </Button>
      )}
      <Divider />

     
      <div>
        {productDetails && productDetails.images.length > 0 &&
          productDetails.images.map((image) => (
            <Badge
              count="X"
              key={image.public_id}
              onClick={() => handleProductImageRemove(image.public_id)}
              style={{ cursor: "pointer" }}
            >
              <Avatar
                src={image.url}
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                shape="square"
                style={{marginLeft: '15px'}}
              />
            </Badge>
          ))}
      </div>
    </>
  );
};

export default FileUpload;
