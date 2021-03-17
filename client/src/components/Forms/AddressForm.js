import React, { useEffect } from 'react';
import { Drawer, Form, Input, Button } from 'antd';

const AddressForm = ({visible, setVisible, form, address, setAddress, loading, addAddressHandler}) => {
    
    let jsonAddress = {name: '', mobile:'', pinCode:'', streetAdd:'', locality:'', City:'', State:''}; 
    if(address.deliveryAddress !== "" && address.deliveryAddress !== undefined)
        jsonAddress = JSON.parse(address.deliveryAddress);

    const showDrawer = () => {
        if(address.mode !== "edit") setAddress({deliveryAddress:'', mode:''})
        setVisible(true);
    };

    const onClose = () => {
        setAddress({deliveryAddress:'', mode:''});
        setVisible(false);
    }

    const onChangeHandler = (e) => {
        setAddress({...address, deliveryAddress : JSON.stringify({...jsonAddress, [e.target.name]: e.target.value})});
    }

    useEffect(() => {
        form.resetFields();
    }, [address.mode]);

    return (
        <>
            {address.mode !== "edit" && <Button type="primary" className="checkout__addnewaddress" size="default" onClick={showDrawer}>ADD NEW ADDRESS</Button>}
            <Drawer
                title={address.mode !== "edit" ? "Add Address" : "Edit Address"}
                width={window.innerWidth > 768 ? 500 : window.innerWidth - 75}
                placement="right"
                closable={true}
                onClose={onClose}
                visible={visible}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name={address.mode !== "edit" ? "Add Address" : "Edit Address"}
                    scrollToFirstError
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input name!' }]}
                        initialValue={jsonAddress.name}
                    >
                        <Input name="name" allowClear onChange={onChangeHandler} />
                    </Form.Item>

                    <Form.Item
                        label="Mobile"
                        name="mobile"
                        rules={[{ required: true, message: 'Please input mobile number!' }]}
                        initialValue={jsonAddress.mobile}
                    >
                        <Input name="mobile" allowClear onChange={onChangeHandler} />
                    </Form.Item>

                    <Form.Item
                        label="Pin Code"
                        name="pinCode"
                        rules={[{ required: true, message: 'Please input pin code!' }]}
                        initialValue={jsonAddress.pinCode}
                    >
                        <Input name="pinCode" allowClear onChange={onChangeHandler} />
                    </Form.Item>

                    <Form.Item
                        label="Street Address"
                        name="streetAdd"
                        rules={[{ required: true, message: 'Please input street address!' }]}
                        initialValue={jsonAddress.streetAdd}
                    >
                        <Input.TextArea rows={2} name="streetAdd" allowClear onChange={onChangeHandler} />
                    </Form.Item>

                    <Form.Item
                        label="Locality/ Town"
                        name="locality"
                        rules={[{ required: true, message: 'Please input locality/ town!' }]}
                        initialValue={jsonAddress.locality}
                    >
                        <Input name="locality" allowClear onChange={onChangeHandler} />
                    </Form.Item>

                    <Form.Item
                        label="City"
                        name="city"
                        rules={[{ required: true, message: 'Please input city!' }]}
                        initialValue={jsonAddress.city}
                    >
                        <Input name="city" allowClear onChange={onChangeHandler} />
                    </Form.Item>

                    <Form.Item
                        label="State"
                        name="state"
                        rules={[{ required: true, message: 'Please input state!' }]}
                        initialValue={jsonAddress.state}
                    >
                        <Input name="state" allowClear onChange={onChangeHandler} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={addAddressHandler} loading={loading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    )
}

export default AddressForm;
