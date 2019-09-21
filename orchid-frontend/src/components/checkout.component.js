import React, {useState} from 'react';
import axios from 'axios';
import SpinnerComponent from './spinner.component';
import '../stylesheets/listing.scss';
import '../stylesheets/detail.scss';
import '../stylesheets/checkout.scss';
import productSVG from '../img/svg/product.svg';
import customerSVG from '../img/svg/users.svg';
import {ButtonComponent as CustomerButton, DetailInfoFields as CustomerInfoFields, SortBar as CustomerSortBar} from './customers.component';
import {ButtonComponent as InventoryButton, DetailInfoFields as InventoryInfoFields, SortBar as InventorySortBar} from './inventory.component';
import {SubmitBar, Detail, ImageUpload} from './Presentational Components/DetailComponents.component';

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
            store: null,
            discount: 0,
            errorMessages: null,
            discountOption: 'customer-discount',
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleDiscountClick = this.handleDiscountClick.bind(this);
        this.handleProductClick = this.handleProductClick.bind(this);
        this.handleCustomerClick = this.handleCustomerClick.bind(this);
        this.toggleDetail = this.toggleDetail.bind(this);
        this.handleStoreChange = this.handleStoreChange.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleSelectCustomer = this.handleSelectCustomer.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
        this.handleCartQuantityChange = this.handleCartQuantityChange.bind(this);
        this.handleCartQuantityOutOfFocus = this.handleCartQuantityOutOfFocus.bind(this);
        this.handleRemoveProductFromCart = this.handleRemoveProductFromCart.bind(this);
        this.handleCheckout = this.handleCheckout.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    componentDidMount(){

        axios.get('http://localhost:3001/inventory/').then(function(response){
            if(response.status === 200){
                response.data.products.forEach(element => {
                    element.checked = false;
                });
                return {products: response.data.products, categories: response.data.categories, stores: response.data.stores, detailProduct: { quantities: null, category: response.data.categories[0]}, store: response.data.stores[0]._id, fetching: false};
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

    handleStoreChange(e){
        var newState = copyObj(this.state);
        newState.cart = [];
        newState.store = newState.stores[newState.stores.map(val => val.name).indexOf(e.target.value.toLowerCase())]._id;
        this.setState(newState);
    }

    handleSearchInput(e){
        this.setState({searchText: e.target.value});
    }

    handleSort(e){
        var sortBy = e.target.textContent;
        sortBy = sortBy.substring(0, sortBy.length-2).toLowerCase().replace(' ', '_');
        if(sortBy === 'purchases') sortBy = 'sales';
        var sortVal = 1;
        if(sortBy == this.state.sortBy)
            sortVal = -(this.state.sortVal);
        this.setState({sortBy: sortBy, sortVal: sortVal});
    }

    toggleDetail(){
        this.setState(
            {
                inDetailMode: false, 
                isViewingCustomer: false, 
                isViewingProduct: false, 
                detail:{ 
                    quantities: null, 
                    category: this.state.categories[0] 
                },
                errorMessages: null
            }
        ); 
    }

    handleAddToCart(product){
        product = JSON.parse(JSON.stringify(this.state.detail));
        if(product.quantities[product.quantities.map(val=>val.store).indexOf(this.state.store)].quantity === 0)
            this.setState({errorMessages: ['The product is out of stock at the current store']});
        else if(this.state.cart.map(val=>val._id).indexOf(product._id) !== -1)
            this.setState({errorMessages: ['The product is already in the cart']});
        else{
        product.quantity = 1;
        this.setState({
            cart: [...this.state.cart, product],
            inDetailMode: false, 
            isViewingCustomer: false, 
            isViewingProduct: false, 
            listingMode: 'inventory',
            detail:{ 
                quantities: null, 
                category: this.state.categories[0] 
            }
        });
    }
    }

    handleSelectCustomer(customer){
        this.setState({
            purchasingCustomer: this.state.detail,
            inDetailMode: false, 
            isViewingCustomer: false, 
            isViewingProduct: false, 
            detail:{ 
                quantities: null, 
                category: this.state.categories[0] 
            },
            discount: this.state.detail.sales/1000 + 5
        });
    }

    handleCartQuantityChange(e, index = 0){
        var newState = copyObj(this.state);
        newState.cart[index].quantity = e.target.value; 
        this.setState(newState);
    }

    handleCartQuantityOutOfFocus(e, index = 0){
        var newState = copyObj(this.state);
        newState.cart[index].quantity = parseInt(e.target.value) ? e.target.value : 1; 
        this.setState(newState);
    }

    handleRemoveProductFromCart(e, index){
        e.preventDefault();
        var newState = copyObj(this.state);
        newState.cart.splice(index, 1);
        this.setState(newState);
    }

    handleCheckout(){
        this.setState({fetching: true});
        axios.post('http://localhost:3001/transactions/new', {
            products: this.state.cart, 
            store: this.state.store, 
            discount: this.state.discount,
            customer: this.state.purchasingCustomer
        })
        .then(function (response) {
            return axios.get('http://localhost:3001/inventory/').then(function(response){
            if(response.status === 200){
                response.data.products.forEach(element => {
                    element.checked = false;
                });
                return {products: response.data.products, categories: response.data.categories, stores: response.data.stores, detailProduct: { quantities: null, category: response.data.categories[0]}, store: response.data.stores[0]._id, fetching: false};
            }
        })
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
            result.cart = [];
            result.purchasingCustomer = null;
            result.fetching = false;
            result.discount = 0;
            result.discountOption = 'customer-discount';
            this.setState(result);
        })
        .catch((err)=>{
            console.log(err);
        })
        
    }

    handleOptionChange(e){
        if(e.target.value.includes('customer'))
            this.setState({discountOption: e.target.value, discount: this.state.purchasingCustomer && this.state.purchasingCustomer.sales/1000+5 || 0});
        this.setState({discountOption: e.target.value});
    }

    handleCustomDiscountChange(e){
        this.setState({discount: e.target.value})
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
        productish = productish.filter((val) => val.name.includes(this.state.searchText) || val.sku.includes(this.state.searchText) ? true : false);
        custish = custish.filter((val) => val.store === this.state.store);
        custish = custish.filter((val) => val.name.toLowerCase().includes(this.state.searchText.toLowerCase()) || val.phone_number.replace(/\W/g,'').includes(this.state.searchText.replace(/\W/g,'')) || val.email.toLowerCase().includes(this.state.searchText.toLowerCase()) || val.card_number.includes(this.state.searchText) ? true : false);
        return(this.state.fetching? <SpinnerComponent /> : (
        <div className="checkout-container">
            <div className="listing-container">
                <h1>CHECKOUT</h1>
                <SearchFilter
                    customer={this.state.purchasingCustomer} 
                    handleFilterChange={this.handleFilterChange} 
                    handleDiscountClick={this.handleDiscountClick}
                    mode={this.listingMode}
                    stores={this.state.stores}
                    store={this.state.store}
                    onChange={this.handleStoreChange}
                    searchText={this.state.searchText}
                    onSearchInput={(e) => {this.setState({searchText: e.target.value})}}
                    handleOptionChange={this.handleOptionChange}
                    selectedOption={this.state.discountOption}
                    handleCustomDiscountChange={this.handleCustomDiscountChange.bind(this)}
                    discount={this.state.discount}
                />
                <ul className="button-list">
                    {this.state.listingMode =='inventory' ? (
                        <React.Fragment>
                            <InventorySortBar 
                                onClick={this.handleSort} 
                                sortBy={this.state.sortBy} 
                                sortVal={this.state.sortVal}
                                checkboxVisibility='none'
                            />
                            {productish.sort(
                                (a,b) => 
                                    a[this.state.sortBy] > b[this.state.sortBy] ? this.state.sortVal : -this.state.sortVal)
                                    .map((val)=>
                                            <li key={val._id}>
                                                <InventoryButton 
                                                    product={val} 
                                                    onClick={this.handleProductClick}
                                                    checkboxVisibility='none'
                                                />
                                            </li>
                                )}
                        </React.Fragment>
                    ):(
                        <React.Fragment>
                        <CustomerSortBar 
                                onClick={this.handleSort} 
                                sortBy={this.state.sortBy} 
                                sortVal={this.state.sortVal}
                                checkboxVisibility='none'
                        />
                        {custish
                            .sort((a,b) => a[this.state.sortBy] > b[this.state.sortBy] ? this.state.sortVal : -this.state.sortVal)
                            .map((val)=><li key={val._id}>
                                    <CustomerButton 
                                        customer={val} 
                                        onClick={this.handleCustomerClick}
                                        checkboxVisibility='none'
                                    />
                                </li>
                            )}
                        </React.Fragment>
                    )
                    }
                </ul>
                
                {this.state.inDetailMode && this.state.isViewingCustomer ? 
                    <div onClick={this.toggleDetail} className='backdrop'> 
                        <Detail 
                            SubmitBar={
                                <SubmitBar 
                                    handleSubmit={this.handleSelectCustomer} 
                                    submitName="Select"
                                />
                            }
                            Image={
                                <div className="detail-image-banner">
                                    <img 
                                        src={
                                            this.state.detail.image && this.state.detail.image.type == 'Buffer'? (
                                                `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, this.state.detail.image.data))}`
                                            ): this.state.detail.image ? (
                                                this.state.detail.image && blobUrl(this.state.detail.image)
                                            ): customerSVG 
                                        } 
                                        alt="Product Image" 
                                    />
                                </div>
                                }
                            DetailInfoFields={
                                <CustomerInfoFields 
                                    handleInputChange={this.handleInputChange} 
                                    customer={this.state.detail}
                                    categories={this.state.categories} 
                                    stores={this.state.stores}  
                                    ErrorMessages={this.state.errorMessages}
                                    disabled={true}
                                />
                            }
                        />
                </div> 
            :this.state.inDetailMode && this.state.isViewingProduct ? ( 
            <div onClick={this.toggleDetail} className='backdrop'> 
                <Detail
                    SubmitBar={
                        <SubmitBar 
                            handleSubmit={this.handleAddToCart} 
                            submitName="Add to Cart"
                        />
                    }

                    Image={
                        <div className="detail-image-banner">
                            <img 
                                src={
                                    this.state.detail.image && this.state.detail.image.type == 'Buffer'? (
                                        `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, this.state.detail.image.data))}`
                                    ): this.state.detail.image ? (
                                        this.state.detail.image && blobUrl(this.state.detail.image)
                                    ): productSVG 
                                } 
                                alt="Product Image" 
                            />
                        </div>
                    }

                    DetailInfoFields={
                        <InventoryInfoFields 
                            handleInputChange={this.handleInputChange} 
                            product={this.state.detail}
                            categories={this.state.categories} 
                            stores={this.state.stores}  
                            ErrorMessages={this.state.errorMessages}
                            disabled={true}
                        />
                    }
                />
            </div>
            ): null}
            </div>

            <div className="cart-container">
                <div className="cart-header"><h1>ITEMS</h1></div>
                <div className="cart-items">
                    {this.state.cart.map((product, index)=>(
                        <CartItem key={product._id} index={index} handleRemoveProductFromCart={this.handleRemoveProductFromCart} product={product} store={this.state.store} onChange={this.handleCartQuantityChange} onOutOfFocus={this.handleCartQuantityOutOfFocus}/>
                    )
                    )}
                    {/* <CartItem product={this.state.cart[this.state.cart.length-1]} store={this.state.store} onChange={this.handleCartQuantityChange}/> */}
                </div>
                <div className="cart-summary">
                        <CartSummary 
                            total={this.state.cart.reduce((acc=0, val) => acc+(val.quantity*val.price), 0)} 
                            handleSubmit={this.handleCheckout}
                            discount={this.state.discount}
                        />
                </div>
            </div>
        </div>
    ));

    }
}

function SearchFilter(props){
    return (
      <div className="search-filter-container">
        <div className="form-group" style={{borderRight: '1px solid white',  paddingRight: 10}}>
        <label htmlFor="search">Search</label>
         <input 
            name="search"
            type="search" 
            className="search-bar"
            style={{marginRight: 10}} 
            placeholder={
             props.mode == 'customer' ? "Enter the customer's name, phone number, email, ..." : "Enter product's name or SKU"
             } onChange={props.onSearchInput} value={props.searchText}/>
        </div>
        <div className="form-group">
        <label htmlFor="inventory">Show:</label>
         <button className="filter-button selected" name="inventory" id="inventory-button" onClick={props.handleFilterChange}>
             Inventory
         </button>
         </div>
         <div className="form-group" style={{borderRight: '1px solid white'}}>
             <label htmlFor="customers"><br/></label>  
            <button className="filter-button" name="customers" id="customers-button" onClick={props.handleFilterChange}>
                Customers
            </button>
         </div>
         <div className="form-group" style={{borderRight: '1px solid white', marginRight: 10}}>
             <label htmlFor="discount"><br/></label>   
            <button className="filter-button" name="discount" onClick={props.handleDiscountClick}>
            Discount ▼
            <div className="filter-tooltip-div" style={{width: '200px', marginLeft:'-100px'}}>
                <ul className = "filter-minmax-list">
                    <li>
                        <input type="radio" id="customer-discount" value='customer-discount' 
                            checked={props.selectedOption === 'customer-discount'} style={{width: '10%', display: 'inline'}}
                            onChange={props.handleOptionChange}
                        />                        
                        <label htmlFor='customer-discount' style={{marginLeft: 0, width: '80%', display: 'inline'}}>Customer Discount</label> 
                    </li>
                    <li>
                        <input type="radio" id="custom-discount" value='custom-discount' 
                            checked={props.selectedOption === 'custom-discount'} style={{width: '10%', display: 'inline'}}
                            onChange={props.handleOptionChange}
                        />                       
                        <label htmlFor='max-price-fitler' style={{marginLeft: 0, display: 'inline'}}>Custom:</label> 
                        <input type="number" min={0} max={100} step={1} value={props.discount} style={{display: 'inline', width: '20%'}} onChange={props.handleCustomDiscountChange} disabled={!(props.selectedOption === 'custom-discount')}/>
                        <span>%</span>
                    </li>
                </ul>
            </div>
        </button>
         </div>
         <div className="form-group" style={{borderRight: '1px solid white', marginRight: 10, paddingRight: 10}}>
                <label htmlFor="store">Store</label>
            <select name="store" className="detail-select" value={props.stores && capitalize(props.stores[props.stores.map(val=>val._id).indexOf(props.store)].name)} onChange={props.onChange}>
                {props.stores.map((store)=><option key={store._id}>{capitalize(store.name)}</option>)}
            </select>
        </div>
         <div className="selected-customer"> 
             {!props.customer ? <React.Fragment>
                 <p>Guest</p> 
                 <p>{props.discount}%</p>
                 </React.Fragment> :(
             <React.Fragment>
                <p>{props.customer.name}</p>
                <p>{props.customer.card_number}</p>
                <p>{props.discount}%</p>
             </React.Fragment>
             )
             }
         </div>
     </div>)
 }
 //--------------------Cart Components------------------------
 function CartItem(props){
     return(
     <div className="cart-single-item">
         <div className="single-item-description">
            <input 
                type="number" 
                className="cart-item-quantity" 
                min={1}
                max={props.product &&props.product.quantities[props.product.quantities.map(val=>val.store).indexOf(props.store)].quantity || 9999}
                value={props.product && props.product.quantity} 
                onChange={(e) => props.onChange(e, props.index)}
                onBlur={(e) => props.onOutOfFocus(e, props.index)}
            />
            <p>X</p>
            <img 
                src={
                    props.product && props.product.image && props.product.image.type == 'Buffer'? (
                        `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, props.product.image.data))}`
                    ):props.product && props.product.image ? (
                        props.product.image && blobUrl(props.product.image)
                    ): productSVG 
                }
                className = "cart-item-image"
            />
            <div className="cart-item-details">
                <h1>{props.product && props.product.name || 'Name'} | <span style={{color: 'coral'}}>${props.product && props.product.price || '25'}</span></h1>
                <h2>SKU: {props.product && props.product.name || '18941894489416549849*/846984/941684165165816581681681681'} </h2>
            </div>
            <div className="cart-item-subtotal">
            <p>${props.product && props.product.quantity*props.product.price || 50}</p>
            </div>
         </div>
         <div className="single-item-remove">
            <a href="" onClick={(e) =>{props.handleRemoveProductFromCart(e, props.index)}}>Remove</a>
         </div>
     </div>
     )
 }

 function CartSummary(props){
    return(
        <React.Fragment>
            <h1 style={{textDecoration: props.discount > 0 ? 'line-through red' : 'none'}}>${parseFloat(props.total).toFixed(2)}</h1>
            {props.discount > 0 ? <h1 style={{color: 'red'}}>${parseFloat(props.total*(1-props.discount/100)).toFixed(2)}</h1>: ''}
            <input type="submit" onClick={props.handleSubmit} value={"Checkout"} className="submit-button" style={{margin: 0}}/>   
        </React.Fragment>
    );
 }

//---------------------Helper Functions-----------------------

let urls = new WeakMap()
let blobUrl = blob => {
      if (urls.has(blob)) {
        return urls.get(blob)
      } else {
        let url = URL.createObjectURL(blob)
        urls.set(blob, url)
        return url
      }
}

function capitalize(str){
    return str[0].toUpperCase() + str.slice(1)
}; 

function copyObj(obj){
    return JSON.parse(JSON.stringify(obj));
}