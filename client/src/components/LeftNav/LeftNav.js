import React from 'react';
import {Link} from 'react-router-dom';

const LeftNav = ({links, title, active}) => {
    return (
        <div className="sidebar">
            <h3>{title}</h3>
            {links && links.length > 0 && links.map(l => {
                return <Link to={l.to} key={l.to} className={l.to === active ? "sidebar__active" : ""}>{l.title}</Link>
            })}
        </div>
    )
}

export default LeftNav;
