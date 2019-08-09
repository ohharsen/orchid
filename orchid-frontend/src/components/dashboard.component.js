import React from 'react';
import {Link} from 'react-router-dom';
import '../stylesheets/dashboard.scss';
import usersSVG from '../img/svg/users.svg';
import checkoutSVG from '../img/svg/checkout.svg';
import inventorySVG from '../img/svg/inventory.svg';
import reportsSVG from '../img/svg/reports.svg';
import settingsSVG from '../img/svg/settings.svg'

function DashboardComponent(props){
    return (
      <div className="dashboard-container">
        <Link to="/checkout"><div className="dashboard-overlay"></div><img src={checkoutSVG}/><h1>Checkout</h1></Link>
        <Link to="/inventory"><div className="dashboard-overlay"></div><img src={inventorySVG}/><h1>Inventory</h1></Link>
        <Link to="/customers"><div className="dashboard-overlay"></div><img src={usersSVG}/><h1>Users</h1></Link>
        <Link to="/reports"><div className="dashboard-overlay"></div><img src={reportsSVG}/><h1>Reports</h1></Link>
        <Link to="/settings"><div className="dashboard-overlay"></div><img src={settingsSVG}/><h1>Settings</h1></Link>
      </div>
    );
  
  }


export default DashboardComponent;