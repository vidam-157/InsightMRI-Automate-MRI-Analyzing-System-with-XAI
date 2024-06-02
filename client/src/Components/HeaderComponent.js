import React from 'react';
import './HeaderComponent.css';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const HeaderComponent = () => { 
  const { username, email, avatar } = useSelector((state) => state.Identity);

  return (
    <div>
      <nav>
        <div className="user-info">
          <div>Welcome, {username}</div>
          <div className="gmail">{email}</div>
        </div>
        <div className='pro-pic'>
          <img src={avatar} className="pic" alt="avatar" />
        </div>
      </nav>  
      <Outlet/>
    </div>
  )
}

export default HeaderComponent;
