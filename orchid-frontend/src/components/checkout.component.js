import React, {useState} from 'react';
import axios from 'axios';
import SpinnerComponent from './spinner.component';
import '../stylesheets/listing.scss';
import '../stylesheets/detail.scss';
import '../stylesheets/checkout.scss';
import productSVG from '../img/svg/product.svg';
import customerSVG from '../img/svg/users.svg';
import {ButtonComponent as CustomerButton} from './customers.component';
import {ButtonComponent as InventoryButton} from './inventory.component';

export default class CheckoutComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            customers: [],
            products: [],
            purchasingCustomer: null,
            fetching: true,
            isViewingProduct: false,
            isViewingCustomer: false,
            inDetailMode: false,
            detail: null,
            sortBy: 'name',
            sortVal: 1,
            listingMode: 'inventory',
            searchText: '',
            cart: [],
            discount: 0
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleDiscountClick = this.handleDiscountClick.bind(this);
        this.handleProductClick = this.handleProductClick.bind(this);
        this.handleCustomerClick = this.handleCustomerClick.bind(this);
    }

    componentDidMount(){
        // .style.visibility = 'none'
        let stateToBe;
        axios.get('http://localhost:3001/inventory/').then(function(response){
            if(response.status === 200){
                response.data.products.forEach(element => {
                    element.checked = false;
                });
                return stateToBe = {products: response.data.products, categories: response.data.categories, stores: response.data.stores, detailProduct: { quantities: null, category: response.data.categories[0]}, fetching: false};
            }
        })
        .then(function(productData){
            return axios.get('http://localhost:3001/customers/').then((response) => {
                if(response.status === 200){
                    response.data.customers.map(val => val.name = val.first_name + ' ' + val.last_name);
                    response.data.customers.forEach(element => {
                        element.checked = false;
                    });
                    productData.customers =  response.data.customers;
                    return productData;
                }
                }) 
        })
        .then((result) => {
            this.setState(result);
        })
        .catch((err)=>{
            console.log(err);
        })
          

    }

    handleFilterChange(e){
        this.setState({listingMode: e.target.name});
        e.target.className = e.target.className + ' selected';
        var options = ['inventory','customers'];
        document.querySelector('#' + options[1 - options.indexOf(e.target.name)]+'-button').className = 'filter-button';
    }

    handleDiscountClick(e){

    }

    handleProductClick(product){
        this.setState(
            {
                detail: this.state.products[this.state.products.map(value => value._id).indexOf(product._id)], 
                isViewingProduct: true, 
                inDetailMode: true
            }
        );
    }

    handleCustomerClick(customer){
        this.setState(
            {
                detail: this.state.customers[this.state.customers.map(value => value._id).indexOf(customer._id)], 
                isViewingCustomer: true, 
                inDetailMode: true
            }
        );
    }

    render(){
        let custish;
        custish =JSON.parse(JSON.stringify(this.state)).customers;
        custish.forEach(val=> val.sales = !val.sales ? 0 : val.sales);
        let productish;
        productish =JSON.parse(JSON.stringify(this.state)).products;
        productish.forEach(function(value) { 
            value.quantities = value.quantities.reduce((acc=0, val) => acc+val.quantity, 0)
            });
        return(this.state.fetching? <SpinnerComponent /> : (
        <div className="checkout-container">
            <div className="listing-container">
                <h1>CHECKOUT</h1>
                <SearchFilter
                    customer={this.state.purchasingCustomer} 
                    handleFilterChange={this.handleFilterChange} 
                    handleDiscountClick={this.handleDiscountClick}
                    mode={this.listingMode}
                />
                <ul className="button-list">
                    {this.state.listingMode =='inventory' ? (
                        productish.sort(
                            (a,b) => 
                                a[this.state.sortBy] > b[this.state.sortBy] ? this.state.sortVal : -this.state.sortVal)
                                .map((val)=>
                                        <li key={val._id}>
                                            <InventoryButton 
                                                product={val} 
                                                onClick={this.handleProductClick}
                                                checkboxVisibility='hidden'
                                            />
                                        </li>
                            )
                    ):(
                        custish
                            .sort((a,b) => a[this.state.sortBy] > b[this.state.sortBy] ? this.state.sortVal : -this.state.sortVal)
                            .map((val)=><li key={val._id}>
                                    <CustomerButton 
                                        customer={val} 
                                        onClick={this.handleCustomerClick}
                                        checkboxVisibility='hidden'
                                    />
                                </li>
                            )
                    )
                    }
                    
                </ul>
            </div>

            <div className="cart-container">

            </div>
        </div>
    ));

    }
}

function SearchFilter(props){
    return (
      <div className="search-filter-container">
         <input 
            type="search" 
            className="search-bar" 
            placeholder={
             props.mode == 'customer' ? "Enter the customer's name, phone number, email, ..." : "Enter product's name or SKU"
             } onChange={props.onSearchInput} value={props.searchText}/>
         <button className="filter-button" name="inventory" id="inventory-button" onClick={props.handleFilterChange}>
             Inventory
         </button>
         <button className="filter-button" name="customers" id="customers-button" onClick={props.handleFilterChange}>
             Customers
         </button>
         <button className="filter-button" onClick={props.handleDiscountClick}>
             Discount
         </button>
         <div className="selected-customer"> 
             {!props.customer ? <p>Guest</p> :(
             <React.Fragment>
                <p>{props.customer.name}</p>
                <p>{props.customer.card_number}</p>
                <p>{5 + Math.floor(props.customer.sales/1000)}%</p>
             </React.Fragment>
             )
             }
         </div>
     </div>)
 }