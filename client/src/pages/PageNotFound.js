import React from 'react';
import {Button} from 'antd';
import { HomeFilled } from '@ant-design/icons';
import {Link} from 'react-router-dom';
import pageNotFound from '../assets/images/404.svg';

const PageNotFound = () => {
    const basicStyle = {
        maxWidth:'1300px',
        margin:'40px auto',
        padding: '16px',
        textAlign:'center',
        background:'#fff'
    }
    return (
        <div style={basicStyle}>
            <img src={pageNotFound} style={{width:'100%',height:'40vh'}}/>
            <h3 style={{marginTop:'40px'}}>You seem to be lost!</h3>
            <Link to="/"><Button style={{textTransform:'uppercase'}} type="primary" size="large" shape="round" icon={<HomeFilled />}>Return to civilization</Button></Link>
        </div>
    )
}

export default PageNotFound;
