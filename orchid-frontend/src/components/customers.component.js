import React, {useState} from 'react';
import axios from 'axios';
import SpinnerComponent from './spinner.component';
import '../stylesheets/listing.scss';
import '../stylesheets/detail.scss';
import customerSVG from '../img/svg/users.svg';

const Categories = React.createContext();

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
                minSale: 0,
                maxSale: Infinity,
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
                this.setState({customers: response.data.customers, stores: response.data.stores, fetching: false});
            }
            }).catch(err => {
                this.setState({products: [], fetching: false});
          });
    }

    handleSearchInput(e){
        this.setState({searchText: e.target.value});
    }

    handleFilterChange(e){
        var state = this.state;
        console.log(e.target.type);
        if(/Price/.test(e.target.name) || /Quantity/.test(e.target.name)){
            if(/min/.test(e.target.name)) state.filters[e.target.name] = Math.min(e.target.value, state.filters['max'+e.target.name.substring(3)]);
            else state.filters[e.target.name] = Math.max(e.target.value, state.filters['min'+e.target.name.substring(3)])
            this.setState(state);
        }
        else if(e.target.type == 'checkbox'){
            var stateBuf = JSON.parse(JSON.stringify(this.state));
            var index = stateBuf.filters.categories.indexOf(e.target.id);
            if(index === -1){
                stateBuf.filters.categories.push(e.target.id);
            }
            else{
                stateBuf.filters.categories.splice(index);
            }
            stateBuf.filters.maxPrice = Infinity;
            stateBuf.filters.maxQuantity = Infinity;
            this.setState(stateBuf);
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
            console.log(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(customer.email));
        if(customer.email && !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(customer.email)){
            errors.push('Not appropriate email format')
        }
        if(errors.length === 0){
        this.setState({fetching: true});
        e.preventDefault();
        const data = new FormData();
        var customer = JSON.parse(JSON.stringify(this.state.detail));
        // customer.category = this.state.categories[this.state.categories.map(val => val.name).indexOf(customer.category.toLowerCase())]._id
        if(this.state.detail.image) data.append('file', this.state.detail.image);
        data.append('customer', JSON.stringify(customer));
        axios.post('http://localhost:3001/customers/new', data).then(response=>{
            console.log(response);
            if(response.status == 500) 
            console.log(response.data);
            else
            this.setState({customers: response.data.customers, fetching: false, isAdding: false, inDetailMode: false, detail:{quantities: null}, errorMessages: null});
        });
    }
    this.setState({errorMessages: errors});
    }

    handleUpdate(e){
        var product = this.state.detail;
        var errors = [];
        if(!product.name){
            errors.push('Name field is required');
        }
        if(!product.sku){
            errors.push('SKU field is required');
        }
        if(!product.price){
            errors.push('Price field is required');
        }
        if(product.quantities.length == 0 || (product.quantities.map(function(val){return val.quantity})).indexOf('') != -1){
            errors.push('Quantities fields are required');
        }
        if(errors.length === 0){
        this.setState({fetching: true});
        e.preventDefault();
        const data = new FormData()
        var product = JSON.parse(JSON.stringify(this.state.detail));
        // product.category = this.state.categories[this.state.categories.map(val => val.name).indexOf(product.category.toLowerCase())]._id;
        console.log(product);
        if(this.state.detail.image) data.append('file', this.state.detail.image);
        data.append('product', JSON.stringify(product));
        axios.put('http://localhost:3001/inventory/update', data).then(response=>{
            console.log(response);
            if(response.status == 500) 
            console.log(response.data);
            else
            this.setState({products: response.data.products, fetching: false, isViewinggProduct: false, inDetailMode: false, detail:{}, errorMessages: null});
        });
    }
    this.setState({errorMessages: errors});
    }

    handleImageUpload(file){
        let {image, ...olState} = this.state.detail; 
        this.setState({detail: {
            ...olState,
            image: file
        }});
    }

    toggleDetail(){
            this.setState({inDetailMode: false, isAdding: false, isViewing: false, detail: {}}); 
    }

    handleInputChange(e){
        var target = e.target;
        var field = target.name;
        var oldState = {...this.state};
        if(field == 'store'){
            oldState.detail[field] = this.state.stores[this.state.stores.map(val => val.name).indexOf(e.target.value.toLowerCase())]
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
        sortBy = sortBy.substring(0, sortBy.length-2).toLowerCase();
        var sortVal = 1;
        if(sortBy == this.state.sortBy)
            sortVal = -(this.state.sortVal);
        this.setState({sortBy: sortBy, sortVal: sortVal});
    }

    render(){
        // var productish;
        // var filters = this.state.filters;
        // productish =JSON.parse(JSON.stringify(this.state)).products;
        // productish = productish.filter((val) => val.name.includes(this.state.searchText) || val.sku.includes(this.state.searchText) ? true : false);
        // productish = productish.filter((val) => filters.categories.indexOf(val.category._id) != -1 || filters.categories.length == 0);
        // productish.forEach(function(value) { 
        // value.quantities = value.quantities.reduce((acc=0, val) => acc+val.quantity, 0)
        // });
        // productish = productish.filter((val) => val.price >= filters.minPrice && val.price <= filters.maxPrice && val.quantities >= filters.minQuantity && val.quantities <= filters.maxQuantity); 
        // //combine filters
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
            {this.state.customers.map((val)=><li key={val._id}>
                    <ButtonComponent 
                        customer={val} 
                        handleCheck={this.handleCheck} 
                        onClick={this.handleView}/>
                </li>
            )}
            </ul>

            <div className="button-bar">
                <button id="delete" onClick={this.handleDelete}>Delete</button>
                <button className="submit-button" onClick={() => this.setState({inDetailMode: true, isAdding: true})}>Add Customer</button>
            </div>

            {this.state.inDetailMode && this.state.isAdding ? 
            <div onClick={this.toggleDetail} className='backdrop'> 
                <Detail
                    SubmitBar={<SubmitBar handleSubmit={this.handleAdd} submitName="Add"/>}
                    ImageUpload={<ImageUpload imageFile={this.state.detail.image || ''} updateImage={this.handleImageUpload}/>}
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
                    ImageUpload={<ImageUpload imageFile={this.state.detail.image || ''} updateImage={this.handleImageUpload}/>}
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
        <input type="search" className="search-bar" placeholder="Enter the Name or SKU..." onChange={props.onSearchInput} value={props.searchText}/>
        <button className="filter-button">
            Price ▼
            <div className="filter-tooltip-div">
                <ul className = "filter-minmax-list">
                    <li>
                        <label htmlFor='min-price-fitler'>Minimum </label> 
                        <input id='min-price-fitler' type="number" name="minPrice" min={0} step={0.01} value={props.filters.minPrice} onChange={props.handleFilterChange}/>
                    </li>
                    <li>
                        <label htmlFor='max-price-fitler'>Maximum </label> 
                        <input id='max-price-fitler' type="number" name="maxPrice" min={0} step={0.01} value={props.filters.maxPrice} onChange={props.handleFilterChange}/>
                    </li>
                </ul>
            </div>
        </button>
        <button className="filter-button">
            Quantity ▼
            <div className="filter-tooltip-div">
                <ul className = "filter-minmax-list">
                    <li>
                        <label htmlFor='min-quantity-fitler'>Minimum </label> 
                        <input id='min-quantity-fitler' type="number" name="minQuantity" min={0} step={1} value={props.filters.minQuantity} onChange={props.handleFilterChange}/>
                    </li>
                    <li>
                        <label htmlFor='max-quantity-fitler'>Maximum </label> 
                        <input id='max-quantity-fitler' type="number" name="maxQuantity" min={0} step={1} value={props.filters.maxQuantity} onChange={props.handleFilterChange}/>
                    </li>
                </ul>
            </div>
        </button>

        {/* <button className="filter-button">
            Categories ▼
            <div className="filter-tooltip-div">
                <ul className="filter-minmax-list">
                {categories.map(category => 
                    <li key={category._id} style={{display: 'flex', alignItems: 'center'}}>
                        <input type="checkbox" style={{flexShrink: 0}} id={category._id} onClick={props.handleFilterChange}/>
                        <label style={{fontSize: '16px'}} htmlFor={category._id}>{capitalize(category.name)}</label>
                    </li>)}
                </ul>
            </div>
        </button> */}
    </div>)
}

function SortBar(props){
    return <div 
    className="sortbar">
    <p></p>
    <p>Image</p>
    <p onClick={props.onClick}>{props.sortBy == 'name' && props.sortVal == 1 ? <u>Name ▲</u> : props.sortBy == 'name' ? <u>Name ▼</u> : 'Name ▼'}</p>
    <p onClick={props.onClick}>{props.sortBy == 'phone_number' && props.sortVal == 1 ? <u>Price ▲</u> : props.sortBy == 'price' ? <u>Price ▼</u> : 'Price ▼'}</p>
    <p onClick={props.onClick}>{props.sortBy == 'date_joined' && props.sortVal == 1 ? <u>Quantities ▲</u> : props.sortBy == 'quantities' ? <u>Quantities ▼</u> : 'Quantities ▼'}</p>
    <p onClick={props.onClick}>{props.sortBy == 'sales' && props.sortVal == 1 ? <u>Cost ▲</u> : props.sortBy == 'cost' ? <u>Cost ▼</u> : 'Cost ▼'}</p>
    <p onClick={props.onClick}>{props.sortBy == 'card_number' && props.sortVal == 1 ? <u>SKU ▲</u> : props.sortBy == 'sku' ? <u>SKU ▼</u> : 'SKU ▼'}</p>
    <p></p>
    </div> 
}

function ButtonComponent(props){

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
    let displayDate = (date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth())  + '/' + (date.getDay() < 10 ? '0' + date.getDay() : date.getDay()) + '/' + date.getFullYear(); 
    return(
        <div 
        className="listing-button" 
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}>
        <p><input type="checkbox" onClick={props.handleCheck} onMouseDown={(e)=>e.stopPropagation()} onMouseUp={(e)=>e.stopPropagation()}/></p>
        <p><img src={url} width='40px' height='40px'/></p>
        <p>{props.customer.first_name + ' ' + props.customer.last_name}</p>
        <p>{props.customer.phone_number}</p>
        <p>{props.customer.email}</p>
        <p>{displayDate}</p>
        <p>{props.customer.sales || 0}</p>
        <p>{props.customer.card_number}</p>
        <p><input id='customerID' type='hidden' value={props.customer._id}/></p>
        </div> 
    );
};

function Detail(props){
    return(
    <div onClick={(e)=>e.stopPropagation()} className = 'detail-div'>
            <div className="detail-top-bar">
                {props.DetailInfoFields}
                {props.ImageUpload}
            </div>
            {props.SubmitBar}
    </div>
    );
}

function DetailInfoFields(props){
    return(
        <div className="detail-info-fields">
        {props.ErrorMessages?
        <React.Fragment>
        <ul className="error-messages">
        <h4>Please fix the following errors:</h4>
                    {props.ErrorMessages.map((val)=>
                        <li key={val}>{val}</li>
                    )}
        </ul> </React.Fragment>: ''}
        <ul className="forms-listing">
            <li>
            <label htmlFor='first_name'>First Name</label>
            <input required type="text" id="first_name" name="first_name" style={{width: '100%'}} onChange={props.handleInputChange} value={props.customer.first_name || ''}/>
            </li>

            <li>
            <label htmlFor='last_name'>Last Name</label>
            <input required type="text" id="last_name" name="last_name" style={{width: '100%'}} onChange={props.handleInputChange} value={props.customer.last_name || ''}/>
            </li>

            <li style={{display: "flex", flexGrow: 1}}>
                <div>
                    <label htmlFor='phone_number'>Phone Number</label>
                    <input required type="text" id="phone_number" name="phone_number" style={{width: '100%'}} onChange={props.handleInputChange} value={props.customer.phone_number || ''}/>
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input required type="email" id="email" name="email" style={{width: '100%'}} onChange={props.handleInputChange} value={props.customer.email || ''}/>
                </div>
            </li>

            <li>
            <label htmlFor='card_number'>Card Number</label>
            <input required type="text" id="card_number" name="card_number" style={{width: '100%'}} onChange={props.handleInputChange} value={props.customer.card_number || ''}/>
            </li>

            <li style={{display: "flex", flexGrow: 1}}>
                <div>
                    <label htmlFor="store">Store</label>
                    <select name="store" className="detail-select" value={props.customer.store && capitalize(props.customer.store.name)} onChange={props.handleInputChange}>
                        {props.stores.map((store)=><option key={store._id}>{capitalize(store.name)}</option>)}
                    </select>
                 </div>
                <div>
                    <label htmlFor='sales'>Sales</label>
                    <input required type="text" id="sales" name="sales" style={{width: '100%'}} onChange={props.handleInputChange} value={props.customer.sales || ''}/>
                </div>
            </li>
        </ul>
        </div>
    );
}

function ImageUpload(props) {
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

    
    
    let onDrag = event => {
        event.preventDefault();
      }
    
    let onDrop = event => {
        event.preventDefault();
        let file = event.dataTransfer.files[0];
        props.updateImage(file);
    }

    let onClick = event => {
        event.stopPropagation();
        if(event.target.tagName=='DIV')
            event.target.lastChild.click();
        else if(event.target.tagName=='IMG')
            event.target.parentNode.lastChild.click();
    }

    let onChange = event => {
        event.preventDefault();
        let file = event.target.files[0];
        props.updateImage(file);
    }
    
    let file  = props.imageFile;
    let url;
    if(file && file.type == 'Buffer'){
        var data = btoa(String.fromCharCode.apply(null, file.data));
        url = file ? `data:image/jpeg;base64,${data}`: customerSVG;
    }
    else{
        url = file && blobUrl(file);
    }
     return (
        <div className="detail-image-banner" onDragOver={onDrag} onDrop={onDrop} onClick={onClick}>
            <img src={url} onClick={onClick} alt="Drop an image!" style={!props.imageFile ? {display: 'none'}: {display: 'block'}}/>
            <p style={props.imageFile ? {display: 'none'}: {display: 'block'}}>Drop or select an image</p>
            <input type = "file" onChange={onChange} accept="image/x-png,image/gif,image/jpeg" style={{display: 'none'}}/>
        </div>
        
      );
  }

function SubmitBar(props){
    return(
        <div className="detail-submit-bar">
                <input type="submit" onClick={props.handleSubmit} value={props.submitName} className="submit-button"/>   
        </div>
    );
}






//----------------------------Helper Functions-----------------------
 function capitalize(str){
     return str[0].toUpperCase() + str.slice(1)
    }; 