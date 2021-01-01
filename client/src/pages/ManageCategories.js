import React, {useEffect, useState} from 'react';
import {List, Card, Divider, notification, Popconfirm, Form, Empty} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AdminLeftNav from '../components/AdminDashboard/AdminLeftNav';
import {create, fetchAll, update, remove} from '../utils/categories-util';
import {useSelector} from 'react-redux';
import CategoryForm from '../components/Forms/CategoryForm';

const ManageCategory = () => {
    const [category, setCategory] = useState({slug:'', name:'', mode:''});
    const [categories, setCategories] = useState([]);
    const {user} = useSelector(state => ({...state}));
    const [visible, setVisible] = useState(false);

    const [form] = Form.useForm();
    const {email, authtoken} = user;
    const openNotificationWithIcon = (type, msgTitle, msgBody)  => {
        notification[type]({
          message: msgTitle,
          description: msgBody
        });
    };

    const createCategoryHandler = async(e) => {
        e.preventDefault();
        if(category.name.length > 1 && category.name.length < 2) return openNotificationWithIcon('error','Category Length Error', 'Please ensure that the category name has at least 2 characters');
        try{
            await form.validateFields();
            try{
                const newCategory = await create(category.name, email, authtoken);
                fetchCategories();
                setCategory({slug:'', name:'', mode:''});
                setVisible(false);
                openNotificationWithIcon('success','Category Created', `${newCategory.data.category} created successfully!`)
            }
            catch(err){
                openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
            }
        }
        catch(err){
            
        }
    }

    const updateCategoryHandler = async(e) => {
        e.preventDefault();
        if(category.name.length > 1 && category.name.length < 2) return openNotificationWithIcon('error','Category Length Error', 'Please ensure that the category name has at least 2 characters');
        try{
            await form.validateFields();
            try{
                const updatedCategory = await update(category.name, email, authtoken, category.slug);
                fetchCategories();
                setCategory({slug:'', name:'', mode:''});
                setVisible(false);
                openNotificationWithIcon('success','Category Updated', `${updatedCategory.data.category} updated successfully!`)
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

    const removeCategoryHandler = async(slug) => {
        try{
            const category = await remove(authtoken, slug, email);
            openNotificationWithIcon('success','Category Deleted', `${category.data.msg}!`)
            fetchCategories();
        }
        catch(err){
            openNotificationWithIcon('error',err.response.statusText, err.response.data.msg);
        }
    }

    const editCategory = async({name, slug, mode}) => {
        setCategory({...category, slug, name, mode: "edit"});
        setVisible(true);
    }

    useEffect(() => {
        fetchCategories();
    }, [])
    return (
      <>
        <div className="admin__wrapper">
          <div className="admin__leftnav">
            <AdminLeftNav />
          </div>
          <div className="admin__content">
            <CategoryForm
              category={category}
              setCategory={setCategory}
              visible={visible}
              setVisible={setVisible}
              createCategoryHandler={createCategoryHandler}
              updateCategoryHandler={updateCategoryHandler}
              form={form}
            />
            <Divider />
            {categories.length > 0 ? (
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
                dataSource={categories}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      actions={[
                        <EditOutlined
                          key="edit"
                          onClick={() =>
                            editCategory({
                              ...category,
                              slug: item.slug,
                              name: item.name,
                            })
                          }
                        />,
                        <Popconfirm
                          title="Are you sure to delete this category?"
                          onConfirm={() => removeCategoryHandler(item.slug)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteOutlined key="ellipsis" />
                        </Popconfirm>,
                      ]}
                    >
                      {item.name}
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
                description={<span>No categories found!</span>}
              />
            )}
          </div>
        </div>
      </>
    );
}

export default ManageCategory;