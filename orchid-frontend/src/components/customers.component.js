import React, {useState} from 'react';
import axios from 'axios';
import SpinnerComponent from './spinner.component';
import '../stylesheets/listing.scss';
import '../stylesheets/detail.scss';
import customerSVG from '../img/svg/users.svg';
import {SubmitBar, Detail, ImageUpload} from './Presentational Components/DetailComponents.component';


export default class CustomerComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            customers: [],
            fetching: true,
            isAdding: false,
            isViewing: false,
            inDetailMode: false,
            filters: {
                minSales: 0,
                maxSales: Infinity,
            },
            detail: {
            },
            sortBy: null,
            sortVal: 1,
            searchText: '',
            errorMessages: null
        }  
        this.componentDidMount=this.componentDidMount.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.toggleDetail = this.toggleDetail.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleView = this.handleView.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleSearchInput = this.handleSearchInput.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }
    componentDidMount(){
        axios.get('http://localhost:3001/customers/').then((response) => {
            if(response.status === 200){
                response.data.customers.map(val => val.name = val.first_name + ' ' + val.last_name);
                response.data.customers.forEach(element => {
                    element.checked = false;
                });
                this.setState({customers: response.data.customers, stores: response.data.stores, fetching: false, detail:{store: response.data.stores[0]._id}});
            }
            }).catch(err => {
                this.setState({customers: [], stores: [], fetching: false, detail:{store: null}});
          });
    }
    handleSearchInput(e){
        this.setState({searchText: e.target.value});
    }

    handleFilterChange(e){
        var state = this.state;
        console.log(e.target.type);
        if(/Sales/.test(e.target.name)){
            if(/min/.test(e.target.name)) state.filters[e.target.name] = Math.min(e.target.value, state.filters['max'+e.target.name.substring(3)]);
            else state.filters[e.target.name] = Math.max(e.target.value, state.filters['min'+e.target.name.substring(3)])
            this.setState(state);
        }
    }

    handleCheck(e){
        var index = this.state.customers.indexOf(this.state.customers.find(customer=>customer._id == e.target.parentNode.parentNode.lastChild.lastChild.value));
        var stateBuf = this.state;
        console.log(index);
        stateBuf.customers[index].checked = !stateBuf.customers[index].checked;
        this.setState(stateBuf);
    }
    
    handleDelete(e){
        var custs = this.state.customers.filter((val) => val.checked).map((val) => val._id);
        if(custs.length === 0) return;
         this.setState({fetching: true});
          axios.delete('http://localhost:3001/customers/', {data: {customers: custs}})
          .then((response) => {
            this.setState({customers: response.data, fetching: false});
            })
          .catch(err => console.log(err));
    }

    handleAdd(e){
        var customer = this.state.detail;
        var errors = [];
        if(!customer.first_name){
            errors.push('First Name field is required');
        }
        if(!customer.last_name){
            errors.push('Last Name field is required');
        }

        if(!customer.phone_number){
            errors.push('Phone Number field is required');
        }
        else if(!/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/.test(customer.phone_number))
        {
            errors.push('Not appropriate phone number format');
        }
        if(customer.email && !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(customer.email)){
            errors.push('Not appropriate email format')
        }
        if(errors.length === 0){
        this.setState({fetching: true});
        e.preventDefault();
        const data = new FormData();
        var customer = JSON.parse(JSON.stringify(this.state.detail));
        // customer.category = this.state.categories[this.state.categories.map(val => val.name).indexOf(customer.category.toLowerCase())]._id
        console.log(this.state.detail.image);
        data.append('file', this.state.detail.image);
        data.append('customer', JSON.stringify(customer));
        console.log(data);
        axios.post('http://localhost:3001/customers/new', data).then(response=>{
            console.log(response);
            response.data.customers.map(val => val.name = val.first_name + ' ' + val.last_name);
            if(response.status == 500) 
            console.log(response.data);
            else
            this.setState({customers: response.data.customers, fetching: false, isAdding: false, inDetailMode: false, errorMessages: null});
        });
    }
    this.setState({errorMessages: errors});
    }

    handleUpdate(e){
        var customer = this.state.detail;
        var errors = [];
        if(!customer.first_name){
            errors.push('First Name field is required');
        }
        if(!customer.last_name){
            errors.push('Last Name field is required');
        }

        if(!customer.phone_number){
            errors.push('Phone Number field is required');
        }
        else if(!/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/.test(customer.phone_number))
        {
            errors.push('Not appropriate phone number format');
        }
        if(customer.email && !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(customer.email)){
            errors.push('Not appropriate email format')
        }
        if(errors.length === 0){
        this.setState({fetching: true});
        e.preventDefault();
        const data = new FormData();
        var customer = JSON.parse(JSON.stringify(this.state.detail));
        // customer.category = this.state.categories[this.state.categories.map(val => val.name).indexOf(customer.category.toLowerCase())]._id
        console.log(this.state.detail.image);
        data.append('file', this.state.detail.image);
        data.append('customer', JSON.stringify(customer));
        console.log(data);
        axios.put('http://localhost:3001/customers/update', data).then(response=>{
            console.log(response);
            response.data.customers.map(val => val.name = val.first_name + ' ' + val.last_name);
            if(response.status == 500) 
            console.log(response.data);
            else
            this.setState({customers: response.data.customers, fetching: false, isAdding: false, inDetailMode: false, errorMessages: null});
        });
    }
    this.setState({errorMessages: errors});
    }

    handleImageUpload(file){
        console.log(file);
        let {image, ...olState} = this.state.detail; 
        this.setState({detail: {
            ...olState,
            image: file
        }});
    }

    toggleDetail(){
            this.setState({
                inDetailMode: false,
                isAdding: false, 
                isViewing: false, 
                detail:{
                    store: this.state.stores[0]._id
                },
                errorMessages: null
            }); 
    }

    handleInputChange(e){
        var target = e.target;
        var field = target.name;
        var oldState = {...this.state};
        if(field == 'store'){
            oldState.detail[field] = this.state.stores[this.state.stores.map(val => val.name).indexOf(e.target.value.toLowerCase())]._id;
        }
        else{
            oldState.detail[field] = target.value;
        }
        this.setState(oldState);
    }

    handleView(customer){
        this.setState({detail: this.state.customers[this.state.customers.map(value => value._id).indexOf(customer._id)], isViewing: true, inDetailMode: true});
    }

    handleSort(e){
        var sortBy = e.target.textContent;
        sortBy = sortBy.substring(0, sortBy.length-2).toLowerCase().replace(' ', '_');
        var sortVal = 1;
        if(sortBy === 'purchases') sortBy = 'sales';
        if(sortBy === this.state.sortBy)
            sortVal = -(this.state.sortVal);
        this.setState({sortBy: sortBy, sortVal: sortVal});
    }

    render(){
        var custish;
        var filters = this.state.filters;
        custish =JSON.parse(JSON.stringify(this.state)).customers;
        custish.forEach(val=> val.sales = !val.sales ? 0 : val.sales);
        custish = custish.filter((val) => val.name.toLowerCase().includes(this.state.searchText.toLowerCase()) || val.phone_number.replace(/\W/g,'').includes(this.state.searchText.replace(/\W/g,'')) || val.email.toLowerCase().includes(this.state.searchText.toLowerCase()) || val.card_number.includes(this.state.searchText) ? true : false);
        custish = custish.filter((val) => val.sales >= filters.minSales && val.sales <= filters.maxSales); 
        //combine filters
        return (this.state.fetching? <SpinnerComponent /> : (
        <div className="container">
            <h1>CUSTOMERS</h1>
            
            <SearchFilter 
                onSearchInput={this.handleSearchInput} 
                searchText={this.state.searchText} 
                filters={this.state.filters} 
                handleFilterChange={this.handleFilterChange}
            />
            
            <SortBar 
                onClick={this.handleSort} 
                sortBy={this.state.sortBy} 
                sortVal={this.state.sortVal}
            />

            <ul className="button-list">
            {custish
            .sort((a,b) => a[this.state.sortBy] > b[this.state.sortBy] ? this.state.sortVal : -this.state.sortVal)
            .map((val)=><li key={val._id}>
                    <ButtonComponent 
                        customer={val} 
                        handleCheck={this.handleCheck} 
                        onClick={this.handleView}/>
                </li>
            )}
            </ul>

            <div className="button-bar">
                <button id="delete" onClick={this.handleDelete}>Delete</button>
                <button className="submit-button" style={{fontSize: 18}} onClick={() => this.setState({inDetailMode: true, isAdding: true})}>Add Customer</button>
            </div>

            {this.state.inDetailMode && this.state.isAdding ? 
            <div onClick={this.toggleDetail} className='backdrop'> 
                <Detail
                    SubmitBar={<SubmitBar handleSubmit={this.handleAdd} submitName="Add"/>}
                    Image={<ImageUpload SVG={customerSVG} imageFile={this.state.detail.image || ''} updateImage={this.handleImageUpload}/>}
                    DetailInfoFields={
                        <DetailInfoFields 
                            handleInputChange={this.handleInputChange} 
                            customer={this.state.detail}
                            stores={this.state.stores}  
                            ErrorMessages={this.state.errorMessages}
                        />
                    }
                />
            </div> : this.state.inDetailMode && this.state.isViewing ? 
            <div onClick={this.toggleDetail} className='backdrop'> 
                <Detail 
                    SubmitBar={<SubmitBar handleSubmit={this.handleUpdate} submitName="Update"/>}
                    Image={<ImageUpload SVG={customerSVG} imageFile={this.state.detail.image || ''} updateImage={this.handleImageUpload}/>}
                    DetailInfoFields={
                        <DetailInfoFields 
                            handleInputChange={this.handleInputChange} 
                            customer={this.state.detail}
                            categories={this.state.categories} 
                            stores={this.state.stores}  
                            ErrorMessages={this.state.errorMessages}
                        />
                    }
                />
            </div> : null}
        </div>
    ));
    }
}

function SearchFilter(props){
   return (
     <div className="search-filter-container">
        <input type="search" className="search-bar" placeholder="Enter the customer's name, phone number, email, ..." onChange={props.onSearchInput} value={props.searchText}/>
        <button className="filter-button">
            Purchases ▼
            <div className="filter-tooltip-div">
                <ul className = "filter-minmax-list">
                    <li>
                        <label htmlFor='min-price-fitler'>Minimum </label> 
                        <input id='min-price-fitler' type="number" name="minSales" min={0} step={0.01} value={props.filters.minSales} onChange={props.handleFilterChange}/>
                    </li>
                    <li>
                        <label htmlFor='max-price-fitler'>Maximum </label> 
                        <input id='max-price-fitler' type="number" name="maxSales" min={0} step={0.01} value={props.filters.maxSales} onChange={props.handleFilterChange}/>
                    </li>
                </ul>
            </div>
        </button>
    </div>)
}

export function SortBar(props){
    return <div 
    className="sortbar">
    <p style={{display: props.checkboxVisibility || 'block'}}></p>
    <p>Image</p>
    <p onClick={props.onClick}>{props.sortBy == 'name' && props.sortVal == 1 ? <u>Name ▲</u> : props.sortBy == 'name' ? <u>Name ▼</u> : 'Name ▼'}</p>
    <p onClick={props.onClick}>{props.sortBy == 'phone_number' && props.sortVal == 1 ? <u>Phone Number ▲</u> : props.sortBy == 'phone_number' ? <u>Phone Number ▼</u> : 'Phone Number ▼'}</p>
    <p onClick={props.onClick}>{props.sortBy == 'email' && props.sortVal == 1 ? <u>Email ▲</u> : props.sortBy == 'email' ? <u>Email ▼</u> : 'Email ▼'}</p>
    <p onClick={props.onClick}>{props.sortBy == 'date_joined' && props.sortVal == 1 ? <u>Date Joined ▲</u> : props.sortBy == 'date_joined' ? <u>Date Joined ▼</u> : 'Date Joined ▼'}</p>
    <p onClick={props.onClick}>{props.sortBy == 'card_number' && props.sortVal == 1 ? <u>Card Number ▲</u> : props.sortBy == 'card_number' ? <u>Card Number ▼</u> : 'Card Number ▼'}</p>
    <p onClick={props.onClick}>{props.sortBy == 'sales' && props.sortVal == 1 ? <u>Purchases ▲</u> : props.sortBy == 'sales' ? <u>Purchases ▼</u> : 'Purchases ▼'}</p>
    </div> 
}

export const ButtonComponent = React.forwardRef((props,ref)=>{

    function handleMouseDown(e){
        if(e.target.type!='INPUT'){
            if(e.target.parentNode.className == 'listing-button')
                e.target.parentNode.className = 'listing-button clicked';
        }
    }  
    function handleMouseUp(e){
        if(e.target.type!='INPUT'){
            if(e.target.parentNode.className == 'listing-button clicked')
                e.target.parentNode.className = 'listing-button';
            props.onClick(props.customer);
        }
    }
    let file  = props.customer.image;
    if(file) {
    var data = btoa(String.fromCharCode.apply(null, file.data));
    }
    let url = file ? `data:image/jpeg;base64,${data}`: customerSVG;
    let date = new Date(props.customer.date_joined);
    let displayDate = //(date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth())  + '/' + (date.getDay() < 10 ? '0' + date.getDay() : date.getDay()) + '/' + date.getFullYear(); 
    (date.getMonth() + 1).toString().padStart(2, 0) + '/' + date.getDate().toString().padStart(2, 0) + '/' + date.getFullYear().toString();
   return(
        <div 
        className="listing-button" 
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        >
        <p style={{display: props.checkboxVisibility  || 'block'}}><input type="checkbox" onClick={props.handleCheck}  onMouseDown={(e)=>e.stopPropagation()} onMouseUp={(e)=>e.stopPropagation()}/></p>
        <p><img src={url} width='40px' height='40px'/></p>
        <p>{props.customer.first_name + ' ' + props.customer.last_name}</p>
        <p>{props.customer.phone_number}</p>
        <p>{props.customer.email}</p>
        <p>{displayDate}</p>
        <p>{props.customer.card_number}</p>
        <p>{props.customer.sales}</p>
        <p style={{display: 'none'}}><input id='customerID' type='hidden' value={props.customer._id}/></p>
        </div> 
    );
});

export function DetailInfoFields(props){
    let date = new Date(props.customer.date_joined);
    let displayDate = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0);
    return(
        <div className="detail-info-fields">
        {props.ErrorMessages?
            <React.Fragment>
                <ul className="error-messages">
                    <h4>Please fix the following errors:</h4>
                        {props.ErrorMessages.map((val)=>
                                <li key={val}>{val}</li>
                            )}
                </ul>    
        </React.Fragment>: ''}
        <ul className="forms-listing">
            <li>
                <label htmlFor='first_name'>First Name</label>
                <input required disabled={props.disabled || false} type="text" id="first_name" name="first_name" style={{width: '100%'}} onChange={props.handleInputChange} value={props.customer.first_name || ''}/>
            </li>

            <li>
                <label htmlFor='last_name'>Last Name</label>
                <input required disabled={props.disabled || false} type="text" id="last_name" name="last_name" style={{width: '100%'}} onChange={props.handleInputChange} value={props.customer.last_name || ''}/>
            </li>

            <li style={{display: "flex", flexGrow: 1, justifyContent: 'space-between'}}>
                <div>
                    <label htmlFor='phone_number'>Phone Number</label>
                    <input required disabled={props.disabled || false} type="text" id="phone_number" name="phone_number" style={{width: '100%'}} onChange={props.handleInputChange} value={props.customer.phone_number || ''}/>
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input required disabled={props.disabled || false} type="email" id="email" name="email" style={{width: '100%'}} onChange={props.handleInputChange} value={props.customer.email || ''}/>
                </div>
            </li>

            <li>
                <label htmlFor='card_number'>Card Number</label>
                <input required disabled={props.disabled || false} type="text" id="card_number" name="card_number" style={{width: '100%'}} onChange={props.handleInputChange} value={props.customer.card_number || ''}/>
            </li>

            <li style={{display: "flex", flexGrow: 1, justifyContent: 'space-between'}}>
                <div>
                    <label htmlFor="store">Store</label>
                    <select disabled={props.disabled || false} name="store" className="detail-select" value={props.customer.store && capitalize(props.stores[props.stores.map(val=>val._id).indexOf(props.customer.store)].name)} onChange={props.handleInputChange}>
                        {props.stores.map((store)=><option key={store._id}>{capitalize(store.name)}</option>)}
                    </select>
                 </div>
                <div>
                    <label htmlFor='sales'>Purchases</label>
                    <input required disabled={props.disabled || false} type="text" id="sales" name="sales" style={{width: '100%'}} onChange={props.handleInputChange} value={props.customer.sales || 0} disabled/>
                </div>
            </li>

            <li>
                <label htmlFor='date_joined'>Date Joined</label>
                <input required disabled={props.disabled || false} type="date" id="date_joined" name="date_joined" style={{width: '100%'}} onChange={props.handleInputChange} value={props.customer.date_joined && displayDate || ''} disabled/>
            </li>
        </ul>
        </div>
    );
}






//----------------------------Helper Functions-----------------------
 function capitalize(str){
     return str[0].toUpperCase() + str.slice(1)
    }; 