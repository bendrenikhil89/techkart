import React, {useState,useEffect} from 'react';
import LeftNav from '../components/LeftNav/LeftNav';
import '../components/AdminDashboard/AdminDashboard.css';
import {Form, List, Card, Divider, notification, Popconfirm, Empty} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {fetchAll} from '../utils/categories-util';
import {fetchAllSubCategories, createSubCategory, removeSubCategory, updatesubCategory} from '../utils/subcategories-util';
import {useSelector} from 'react-redux';
import SubCategoryForm from '../components/Forms/SubCategoryForm';

const ManageSubCategories = () => {
    const [subCategory, setSubCategory] = useState({slug:'', name:'', mode:'new'});
    const [subCategories, setSubCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    
    const [form] = Form.useForm();
    const {user} = useSelector(state => ({...state}));
    const [visible, setVisible] = useState(false);
    const {email, authtoken} = user;
    
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

    const createSubCategoryHandler = async(e) => {
        e.preventDefault();
        try{
          await form.validateFields();
          if(subCategory.name.length > 1 && subCategory.name.length < 2) return openNotificationWithIcon('error','Sub Category Length Error', 'Please ensure that the sub category name has at least 2 characters');
          try{
              const newSubCategory = await createSubCategory({name: subCategory.name,parent: category}, email, authtoken);
              fetchSubCategories();
              setCategory(null);
              setSubCategory({slug:'', name:'', mode:'new'});
              setVisible(false);
              openNotificationWithIcon('success','Sub Category Created', `${newSubCategory.data.subCategory} created successfully!`)
          }
          catch(err){
              openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
          }
        }
        catch(err){

        }
    }

    const updateSubCategoryHandler = async(e) => {
        e.preventDefault();
        try{
          await form.validateFields();
          if(subCategory.name.length > 1 && subCategory.name.length < 2) return openNotificationWithIcon('error','Sub Category Length Error', 'Please ensure that the sub category name has at least 2 characters');
          try{
              const updatedSubCategory = await updatesubCategory({name: subCategory.name, parent: category}, email, authtoken, subCategory.slug);
              fetchSubCategories();
              setCategory(null);
              setSubCategory({slug:'', name:'', mode:'new'});
              setVisible(false);
              openNotificationWithIcon('success','Sub Category Updated', `${updatedSubCategory.data.subCategory} updated successfully!`)
          }
          catch(err){
              openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
          }
        }
        catch(err){

        }
    }

    const fetchCategories = async() => {
        try{
            const categories = await fetchAll();
            setCategories(categories.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const fetchSubCategories = async() => {
        try{
            const subCategories = await fetchAllSubCategories();
            setSubCategories(subCategories.data);
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const removeSubCategoryHandler = async(slug) => {
        try{
            const subCategory = await removeSubCategory(authtoken, slug, email);
            openNotificationWithIcon('success','Sub Category Deleted', `${subCategory.data.msg}!`)
            fetchSubCategories();
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    function onChange(value) {
        setCategory(value);
    }

    const editSubCategory = async({name, slug, parent}) => {
        setSubCategory({...category, slug, name, mode: "edit"});
        setCategory(parent);
        setVisible(true);
    }

    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
    }, []);

    return (
      <>
        <div className="admin__wrapper">
          <div className="main__leftnav">
                <LeftNav links={links} title="Admin Dashboard" active="/dashboard/admin/subcategories" />
          </div>
          <div className="admin__content">
            <SubCategoryForm
              createSubCategoryHandler={createSubCategoryHandler}
              updateSubCategoryHandler={updateSubCategoryHandler}
              onChange={onChange}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
              category={category}
              setCategory={setCategory}
              categories={categories}
              visible={visible}
              setVisible={setVisible}
              form={form}
            />
            <Divider />
            {subCategories.length > 0 ? (
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 2,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
                }}
                dataSource={subCategories}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      actions={[
                        <EditOutlined
                          key="edit"
                          onClick={() =>
                            editSubCategory({
                              slug: item.slug,
                              name: item.name,
                              parent: item.parent,
                            })
                          }
                        />,
                        <Popconfirm
                          title="Are you sure to delete this sub category?"
                          onConfirm={() => removeSubCategoryHandler(item.slug)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteOutlined key="ellipsis" />
                        </Popconfirm>,
                      ]}
                    >
                      {`${item.name}`}
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{
                  height: 60,
                }}
                description={<span>No sub categories found!</span>}
              />
            )}
          </div>
        </div>
      </>
    );
}

export default ManageSubCategories;