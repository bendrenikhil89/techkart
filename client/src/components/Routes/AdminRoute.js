import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {useSelector} from 'react-redux';

export default function AdminRoute({component: Component, ...rest}) {
    const {user} = useSelector(state => ({...state}));
    return (
        <Route
          {...rest}
          render={props => {
            return (user && user.role === 'admin') ? <Component {...props} /> : <Redirect to="/login" />
          }}
        ></Route>
    )
}