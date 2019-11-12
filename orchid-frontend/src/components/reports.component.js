import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Switch, NavLink, Redirect} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Spinner from './spinner.component';
import '../stylesheets/reports.scss';
import "react-datepicker/dist/react-datepicker.css";


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
    const [state, setState] = useState({
        begginingDate: new Date(),
        endingDate: new Date()
    });

    useEffect(()=>{
        axios.get('http://localhost:3001/transactions/').then((response) => {
            if(response.status === 200){
                setState({
                    sellTransactions: response.data.sellTransactions, 
                    returnTransactions: response.data.returnTransactions, 
                    stores: response.data.stores, 
                    categories: response.data.categories,
                    transactions: response.data.transactions,
                    begginingDate: new Date(),
                    endingDate: new Date()
                }
                );
            }
            }).catch(err => {
                console.log(err);
          });
    }, []);

    function handleBegDateChange(date){
        var newState = JSON.parse(JSON.stringify(state));
        newState.begginingDate = date;
        newState.endingDate = state.endingDate;
        console.log(newState);
        setState(newState);
    }

    function handleEndDateChange(date){
        var newState = JSON.parse(JSON.stringify(state));
        newState.begginingDate = state.begginingDate;
        newState.endingDate = date;
        setState(newState);
    }
    console.log(state);
    let totalQuantity = 0;
    let totalSales = 0;
    return (
        <React.Fragment>
            <h1>SALES REPORTS</h1>
            <SalesFilters
                begginingDate={state.begginingDate}
                endingDate={state.endingDate}
                handleBegDateChange={handleBegDateChange}
                handleEndDateChange={handleEndDateChange}
             />
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
                    {state.transactions && state.transactions
                    .filter((val)=>{
                        let date = new Date(val.date);
                        return state.begginingDate <= date && state.endingDate >= date;
                    })
                    .map((val)=>{
                    let date = new Date(val.date);
                    let displayDate = (date.getMonth() + 1).toString().padStart(2, 0) + '/' + date.getDate().toString().padStart(2, 0) + '/' + date.getFullYear().toString();
                
                        return (
                            <ul className="table-row" key={val._id}>
                                <li>{val._id}</li>
                                <li>{val.products.reduce((acc=0, val) => {totalQuantity+=val.quantity; return acc + val.quantity}, 0)}</li>
                                <li>{val.products.reduce((acc=0, val) => {totalSales+=(val.quantity*val.product.price); return acc + (val.quantity*val.product.price)}, 0)}</li>
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
                                    <li style={{flexGrow: 0}}><b>{totalQuantity}</b></li>
                                    <li style={{flexGrow: 0}}><b>${totalSales}</b></li>
            
                </ul>
                </div>
            </div> 
        </React.Fragment>
    );
}


function LowStockReports(props){
    const [state, setState] = useState({pending: true});

    useEffect(()=>{
        axios.get('http://localhost:3001/inventory/').then((response) => {
            if(response.status === 200){
                setState({
                    products: response.data.products,
                    stores: response.data.stores, 
                    categories: response.data.categories,
                    pending: false
                }
                );
            }
            }).catch(err => {
                console.log(err);
          });
    }, []);

    
    console.log(state);
    let totalQuantity = 0;
    let totalSales = 0;
    let products = [];
    if(state.products)
    state.products.forEach((prod) =>{
        prod.quantities.forEach((quant) => {
            console.log(quant.store);
            if((localStorage.lowStock && quant.quantity <= localStorage.lowStock) || (quant.quantity == 1 || quant.quantity == 0)){
                products.push({
                    _id: prod._id,
                    sku: prod.sku,
                    name: prod.name,
                    price: prod.price,
                    quantity: quant.quantity,
                    store: quant.store.name,
                    category: prod.category.name
                });
            }
        })
    });
    return (
        <React.Fragment>
            <h1>LOW STOCK ITEMS</h1>
            <div className="reports-table">
                <div className="table-header">
                    <ul className="table-row" style={{height: 30, lineHeight: 2}}>
                                    <li>SKU</li>
                                    <li>Name</li>
                                    <li>Price</li>
                                    <li>Quantity</li>
                                    <li>Store</li>
                                    <li>Category</li>
                                </ul>
                    </div>
                <div className="table-main">
                    {products ? products.map((val) => {
                        return <ul className="table-row" key={val._id}>
                                <li>{val.sku}</li>
                                <li>{val.name}</li>
                                <li>{val.price}</li>
                                <li style={{color: "red"}}>{val.quantity}</li>
                                <li>{val.store}</li>
                                <li>{val.category}</li>
                            </ul>
                    }): <Spinner/>                       
                    }
                </div>
                <div className="table-footer">
                 <ul className="table-row" style={{height: 30, lineHeight: 2}}>
                                    <li style={{flexGrow: 0}}><b>Total</b></li>
                                    <li style={{flexGrow: 0}}><b>{totalQuantity}</b></li>
                                    <li style={{flexGrow: 0}}><b>${totalSales}</b></li>
            
                </ul>
                </div>
            </div> 
        </React.Fragment>
    );
}

function SalesFilters(props){
    const [selectedDate, setSelectedDate] = useState(new Date());
    return(
        <React.Fragment>
         <div className="search-filter-container" style={{width: '70%'}}>
            <button className="filter-button">
                From Date ▼
                <div className="filter-tooltip-div" style={{width: 250, marginLeft: -125}}>
                    <DatePicker
                        selectsStart
                        startDate={props.begginingDate}
                        endDate={props.endingDate}
                        selected={props.begginingDate}
                        onChange={date => props.handleBegDateChange(date)}
                        inline
                    />
                </div>
            </button>
            <button className="filter-button">
                To Date ▼
                <div className="filter-tooltip-div" style={{width: 250, marginLeft: -125}}>
                    <DatePicker
                        selectsEnd
                        startDate={props.begginingDate}
                        endDate={props.endingDate}
                        minDate={props.begginingDate}
                        selected={props.endingDate}
                        onChange={date => props.handleEndDateChange(date)}
                        inline
                    />
                </div>
            </button>
         </div>
        
        </React.Fragment>
    );
}






