import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Switch, NavLink, Redirect} from 'react-router-dom';
import '../stylesheets/reports.scss';

export default function ReportsComponent(props) {
        console.log(`${props.match.path}/`);

        function handleClick(){

        }

        return (
            <div className = "reports-container">
                <aside className = "reports-sidebar">
                    <NavLink to={`${props.match.path}/sales`} className="reports-sidebar-link" activeStyle={{textDecoration: 'none'}} onClick={handleClick}>SALES REPORT</NavLink>
                    <NavLink to={`${props.match.path}/low-stock`} className="reports-sidebar-link" activeStyle={{textDecoration: 'none'}} onClick={handleClick}>LOW STOCK REPORT</NavLink>
                </aside>
                <div className = "reports-main">
                    <Switch>
                        <Route path = {`${props.match.path}/sales`} component={SalesReports}/>
                        <Route path = {`${props.match.path}/low-stock`} component={LowStockReports}/>
                        <Route exact path = {`${props.match.path}/`} component={() => <Redirect to={`${props.match.path}/sales`} />}/>
                    </Switch>   
                </div>
            </div>
        );
}

function SalesReports(props){
    const [state, setState] = useState({});

    useEffect(()=>{
        axios.get('http://localhost:3001/transactions/').then((response) => {
            if(response.status === 200){
                setState({
                    sellTransactions: response.data.sellTransactions, 
                    returnTransactions: response.data.returnTransactions, 
                    stores: response.data.stores, 
                    categories: response.data.categories,
                    transactions: response.data.transactions
                }
                );
            }
            }).catch(err => {
                console.log(err);
          });
    }, []);
    console.log(state);
    return (
        <React.Fragment>
            <h1>SALES REPORTS</h1>
            <SalesFilters />
            <div className="reports-table">
                <div className="table-header">
                    <ul className="table-row" style={{height: 30, lineHeight: 2}}>
                                    <li>Transaction ID</li>
                                    <li>Items Quantity</li>
                                    <li>Sale Amount</li>
                                    <li>Customer</li>
                                    <li>Store</li>
                                    <li>Date</li>
                                </ul>
                    </div>
                <div className="table-main">
                    {state.transactions && state.transactions.map((val)=>{
                    let date = new Date(val.date);
                    let displayDate = (date.getMonth() + 1).toString().padStart(2, 0) + '/' + date.getDate().toString().padStart(2, 0) + '/' + date.getFullYear().toString();
                
                        return (
                            <ul className="table-row" key={val._id}>
                                <li>{val._id}</li>
                                <li>{val.products.reduce((acc=0, val) => acc + val.quantity, 0)}</li>
                                <li>{val.products.reduce((acc=0, val) => acc + (val.quantity*val.product.price), 0)}</li>
                                <li>{val.customer ? val.customer.first_name + ' ' + val.customer.last_name: 'Guest'}</li>
                                <li>{val.store.name}</li>
                                <li>{displayDate}</li>
                            </ul>
                        );
                    })}
                    {state.transactions && state.transactions.map((val)=>{
                    let date = new Date(val.date);
                    let displayDate = (date.getMonth() + 1).toString().padStart(2, 0) + '/' + date.getDate().toString().padStart(2, 0) + '/' + date.getFullYear().toString();
                
                        return (
                            <ul className="table-row" key={val._id}>
                                <li>{val._id}</li>
                                <li>{val.products.reduce((acc=0, val) => acc + val.quantity, 0)}</li>
                                <li>{val.products.reduce((acc=0, val) => acc + (val.quantity*val.product.price), 0)}</li>
                                <li>{val.customer ? val.customer.first_name + ' ' + val.customer.last_name: 'Guest'}</li>
                                <li>{val.store.name}</li>
                                <li>{displayDate}</li>
                            </ul>
                        );
                    })}
                    {state.transactions && state.transactions.map((val)=>{
                    let date = new Date(val.date);
                    let displayDate = (date.getMonth() + 1).toString().padStart(2, 0) + '/' + date.getDate().toString().padStart(2, 0) + '/' + date.getFullYear().toString();
                
                        return (
                            <ul className="table-row" key={val._id}>
                                <li>{val._id}</li>
                                <li>{val.products.reduce((acc=0, val) => acc + val.quantity, 0)}</li>
                                <li>{val.products.reduce((acc=0, val) => acc + (val.quantity*val.product.price), 0)}</li>
                                <li>{val.customer ? val.customer.first_name + ' ' + val.customer.last_name: 'Guest'}</li>
                                <li>{val.store.name}</li>
                                <li>{displayDate}</li>
                            </ul>
                        );
                    })}
                    {state.transactions && state.transactions.map((val)=>{
                    let date = new Date(val.date);
                    let displayDate = (date.getMonth() + 1).toString().padStart(2, 0) + '/' + date.getDate().toString().padStart(2, 0) + '/' + date.getFullYear().toString();
                
                        return (
                            <ul className="table-row" key={val._id}>
                                <li>{val._id}</li>
                                <li>{val.products.reduce((acc=0, val) => acc + val.quantity, 0)}</li>
                                <li>{val.products.reduce((acc=0, val) => acc + (val.quantity*val.product.price), 0)}</li>
                                <li>{val.customer ? val.customer.first_name + ' ' + val.customer.last_name: 'Guest'}</li>
                                <li>{val.store.name}</li>
                                <li>{displayDate}</li>
                            </ul>
                        );
                    })}
                    {state.transactions && state.transactions.map((val)=>{
                    let date = new Date(val.date);
                    let displayDate = (date.getMonth() + 1).toString().padStart(2, 0) + '/' + date.getDate().toString().padStart(2, 0) + '/' + date.getFullYear().toString();
                
                        return (
                            <ul className="table-row" key={val._id}>
                                <li>{val._id}</li>
                                <li>{val.products.reduce((acc=0, val) => acc + val.quantity, 0)}</li>
                                <li>{val.products.reduce((acc=0, val) => acc + (val.quantity*val.product.price), 0)}</li>
                                <li>{val.customer ? val.customer.first_name + ' ' + val.customer.last_name: 'Guest'}</li>
                                <li>{val.store.name}</li>
                                <li>{displayDate}</li>
                            </ul>
                        );
                    })}
                </div>
                <div className="table-footer">
                 <ul className="table-row" style={{height: 30, lineHeight: 2}}>
                                    <li style={{flexGrow: 0}}><b>Total</b></li>
                                    <li style={{flexGrow: 0}}><b>85</b></li>
                                    <li style={{flexGrow: 0}}><b>8500</b></li>
            
                </ul>
                </div>
            </div> 
        </React.Fragment>
    );
}

function SalesFilters(props){
    return(
        <React.Fragment>
         <div className="search-filter-container" style={{width: '70%'}}>
            <button className="filter-button">
                Price ▼
                <div className="filter-tooltip-div">
                    
                </div>
            </button>
            <button className="filter-button">
                Price ▼
                <div className="filter-tooltip-div">
                    
                </div>
            </button>
            <button className="filter-button">
                Price ▼
                <div className="filter-tooltip-div">
                    
                </div>
            </button>
         </div>
        
        </React.Fragment>
    );
}


function LowStockReports(props){
    return(
        <h1>Low Stock</h1>
    );
}

