import React, {useState} from 'react';
import axios from 'axios';
import SpinnerComponent from './spinner.component';
import '../stylesheets/listing.scss';
import '../stylesheets/detail.scss';
import productSVG from '../img/svg/product.svg';

const Categories = React.createContext();

export default class InventoryComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            products: [],
            fetching: true,
            isAddingProduct: false,
            isViewingProduct: false,
            inDetailMode: false,
            filters: {
                minPrice: 0,
                maxPrice: Infinity,
                minQuantity: 0,
                maxQuantity: Infinity,
                categories: []
            },
            detailProduct: {
                quantities: null
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
        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUpdateProduct = this.handleUpdateProduct.bind(this);
        this.handleViewProduct = this.handleViewProduct.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleSearchInput = this.handleSearchInput.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }
    componentDidMount(){
        axios.get('http://localhost:3001/inventory/').then((response) => {
            if(response.status === 200){
                response.data.products.forEach(element => {
                    element.checked = false;
                });
                this.setState({products: response.data.products, categories: response.data.categories, stores: response.data.stores, detailProduct: { quantities: null, category: response.data.categories[0]}, fetching: false});
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
        var index = this.state.products.indexOf(this.state.products.find(product=>product._id == e.target.parentNode.parentNode.lastChild.lastChild.value));
        var stateBuf = this.state;
        console.log(index);
        stateBuf.products[index].checked = !stateBuf.products[index].checked;
        this.setState(stateBuf);
    }
    
    handleDelete(e){
        var prods = this.state.products.filter((val) => val.checked).map((val) => val._id);
        if(prods.length === 0) return;
         this.setState({fetching: true});
          axios.delete('http://localhost:3001/inventory/', {data: {products: prods}})
          .then((response) => {
            this.setState({products: response.data, fetching: false});
            })
          .catch(err => console.log(err));
    }

    handleAddProduct(e){
        var product = this.state.detailProduct;
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
        const data = new FormData();
        var product = JSON.parse(JSON.stringify(this.state.detailProduct));
        // product.category = this.state.categories[this.state.categories.map(val => val.name).indexOf(product.category.toLowerCase())]._id
        console.log(this.state.detailProduct.image);
        if(this.state.detailProduct.image) data.append('file', this.state.detailProduct.image);
        data.append('product', JSON.stringify(product));
        axios.post('http://localhost:3001/inventory/new', data).then(response=>{
            console.log(response);
            if(response.status == 500) 
            console.log(response.data);
            else
            this.setState({products: response.data.products, fetching: false, isAddingProduct: false, inDetailMode: false, detailProduct: { quantities: null, category: this.state.categories[0] }, errorMessages: null});
        });
    }
    this.setState({errorMessages: errors});
    }

    handleUpdateProduct(e){
        var product = this.state.detailProduct;
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
        var product = JSON.parse(JSON.stringify(this.state.detailProduct));
        // product.category = this.state.categories[this.state.categories.map(val => val.name).indexOf(product.category.toLowerCase())]._id;
        console.log(product);
        if(this.state.detailProduct.image) data.append('file', this.state.detailProduct.image);
        data.append('product', JSON.stringify(product));
        axios.put('http://localhost:3001/inventory/update', data).then(response=>{
            console.log(response);
            if(response.status == 500) 
            console.log(response.data);
            else
            this.setState({products: response.data.products, fetching: false, isViewinggProduct: false, inDetailMode: false, detailProduct: { quantities: null, category: this.state.categories[0] }, errorMessages: null});
        });
    }
    this.setState({errorMessages: errors});
    }

    handleImageUpload(file){
        let {image, ...olState} = this.state.detailProduct; 
        this.setState({detailProduct: {
            ...olState,
            image: file
        }});
    }

    toggleDetail(){
            this.setState({inDetailMode: false, isAddingProduct: false, isViewingProduct: false, detailProduct: { quantities: null, category: this.state.categories[0] }}); 
    }

    handleInputChange(e){
        var target = e.target;
        var field = target.name;
        var oldState = {...this.state};
        if(/store/.test(target.id)){
            var index = oldState.detailProduct['quantities'] && oldState.detailProduct['quantities'].map(function(val){return val.store}).indexOf(field);
            if(index ===null){
                oldState.detailProduct['quantities'] = [];
                oldState.detailProduct['quantities'].push({store: field, quantity:  target.value});
            }
            else if(index ===-1)
                oldState.detailProduct['quantities'].push({store: field, quantity:  target.value});
            else
                oldState.detailProduct['quantities'][index]['quantity'] = target.value;
        }
        else if(field == 'category'){
            oldState.detailProduct[field] = this.state.categories[this.state.categories.map(val => val.name).indexOf(e.target.value.toLowerCase())]
        }
        else{
            oldState.detailProduct[field] = target.value;
        }
        this.setState(oldState);
    }

    handleViewProduct(product){
        this.setState({detailProduct: this.state.products[this.state.products.map(value => value._id).indexOf(product._id)], isViewingProduct: true, inDetailMode: true});
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
        var productish;
        var filters = this.state.filters;
        productish =JSON.parse(JSON.stringify(this.state)).products;
        productish = productish.filter((val) => val.name.includes(this.state.searchText) || val.sku.includes(this.state.searchText) ? true : false);
        productish = productish.filter((val) => filters.categories.indexOf(val.category._id) != -1 || filters.categories.length == 0);
        productish.forEach(function(value) { 
        value.quantities = value.quantities.reduce((acc=0, val) => acc+val.quantity, 0)
        });
        productish = productish.filter((val) => val.price >= filters.minPrice && val.price <= filters.maxPrice && val.quantities >= filters.minQuantity && val.quantities <= filters.maxQuantity); 
        //combine filters
        return (this.state.fetching? <SpinnerComponent /> : (
        <Categories.Provider value={this.state.categories}>
        <div className="container">
            <h1>INVENTORY</h1>
            <SearchFilter onSearchInput={this.handleSearchInput} searchText={this.state.searchText} filters={this.state.filters} handleFilterChange={this.handleFilterChange}/>
            <SortBar onClick={this.handleSort} sortBy={this.state.sortBy} sortVal={this.state.sortVal}/>
            <ul className="button-list">
            {productish.sort((a,b) => a[this.state.sortBy] > b[this.state.sortBy] ? this.state.sortVal : -this.state.sortVal).map((val)=><li key={val._id}><ProductButtonComponent product={val} handleCheck={this.handleCheck} onClick={this.handleViewProduct}/></li>)}
            </ul>
            <div className="button-bar">
            <button id="delete" onClick={this.handleDelete}>Delete</button>
            <button className="submit-button" onClick={() => this.setState({inDetailMode: true, isAddingProduct: true})}>Add Product</button>
            </div>
            {this.state.inDetailMode && this.state.isAddingProduct ? <div onClick={this.toggleDetail} className='backdrop'> 
            <Detail
            
            SubmitBar={<SubmitBar handleSubmit={this.handleAddProduct} submitName="Add"/>}
            ImageUpload={<ImageUpload imageFile={this.state.detailProduct.image || ''} updateImage={this.handleImageUpload}/>}
            DetailInfoFields={<DetailInfoFields handleInputChange={this.handleInputChange} product={this.state.detailProduct}
                                categories={this.state.categories} stores={this.state.stores}  ErrorMessages={this.state.errorMessages}/>}
            /></div> : this.state.inDetailMode && this.state.isViewingProduct ? 
            <div onClick={this.toggleDetail} className='backdrop'> 
            <Detail
            
            SubmitBar={<SubmitBar handleSubmit={this.handleUpdateProduct} submitName="Update"/>}
            ImageUpload={<ImageUpload imageFile={this.state.detailProduct.image || ''} updateImage={this.handleImageUpload}/>}
            DetailInfoFields={<DetailInfoFields handleInputChange={this.handleInputChange} product={this.state.detailProduct}
                                categories={this.state.categories} stores={this.state.stores}  ErrorMessages={this.state.errorMessages}/>}
            /></div> : null}
        </div>
        </Categories.Provider>
    ));
    }
}

function SearchFilter(props){
   return <Categories.Consumer>
    {categories =>(
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

        <button className="filter-button">
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
        </button>
    </div>)}
    </Categories.Consumer>
}

function SortBar(props){
    return <div 
    className="sortbar">
    <p></p>
    <p>Image</p>
    <p onClick={props.onClick}>{props.sortBy == 'name' && props.sortVal == 1 ? <u>Name ▲</u> : props.sortBy == 'name' ? <u>Name ▼</u> : 'Name ▼'}</p>
    <p onClick={props.onClick}>{props.sortBy == 'price' && props.sortVal == 1 ? <u>Price ▲</u> : props.sortBy == 'price' ? <u>Price ▼</u> : 'Price ▼'}</p>
    <p onClick={props.onClick}>{props.sortBy == 'quantities' && props.sortVal == 1 ? <u>Quantities ▲</u> : props.sortBy == 'quantities' ? <u>Quantities ▼</u> : 'Quantities ▼'}</p>
    <p onClick={props.onClick}>{props.sortBy == 'cost' && props.sortVal == 1 ? <u>Cost ▲</u> : props.sortBy == 'cost' ? <u>Cost ▼</u> : 'Cost ▼'}</p>
    <p onClick={props.onClick}>{props.sortBy == 'sku' && props.sortVal == 1 ? <u>SKU ▲</u> : props.sortBy == 'sku' ? <u>SKU ▼</u> : 'SKU ▼'}</p>
    <p></p>
    </div> 
}

function ProductButtonComponent(props){

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
            props.onClick(props.product);
        }
    }
    let file  = props.product.image;
    if(file) {
    var data = btoa(String.fromCharCode.apply(null, file.data));
    }
    let url = file ? `data:image/jpeg;base64,${data}`: productSVG;
    return(
        <div 
        className="listing-button" 
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}>
        <p><input type="checkbox" onClick={props.handleCheck} onMouseDown={(e)=>e.stopPropagation()} onMouseUp={(e)=>e.stopPropagation()}/></p>
        <p><img src={url} width='40px' height='40px'/></p>
        <p>{props.product.name}</p>
        <p>{props.product.price}</p>
        <p>{props.product.quantities}</p>
        <p>{props.product.cost}</p>
        <p>{props.product.sku}</p>
        <p><input id='productID' type='hidden' value={props.product._id}/></p>
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
            <label htmlFor='name'>Name*</label>
            <input required type="text" id="name" name="name" style={{width: '100%'}} onChange={props.handleInputChange} value={props.product.name || ''}/>
            <label htmlFor='sku'>SKU*</label>
            <input type="text" id="sku" name="sku" style={{width: '100%'}} onChange={props.handleInputChange} value={props.product.sku || ''}/>
            <div className="smaller-inputs">
            <p>
            <label htmlFor='price'>Price*</label>
            <input type="number" id="price" name="price" min={0} step={0.01} onChange={props.handleInputChange} value={props.product.price || ''}/>
            </p>
            <p>
            <label htmlFor='cost'>Cost</label>
            <input type="number" id="cost" name="cost" min={0} step={0.01} onChange={props.handleInputChange} value={props.product.cost || ''}/> 
            </p>
            <p>
                <label htmlFor="category">Categories</label>
                <select name="category" className="detail-select" value={props.product.category && capitalize(props.product.category.name)} onChange={props.handleInputChange}>
                    {props.categories.map((category)=><option key={category._id}>{capitalize(category.name)}</option>)}
                </select>
            </p>
            <section>
                <h3>Quantities*</h3>
            <ul className="stores-list">
                {props.stores.map((store, index)=>
                <li key={store._id}>
                    <label htmlFor={`store_${store.name}`}> {capitalize(store.name)}:</label>
                        <input type='number' name={store._id} min={0} step={1} onChange={props.handleInputChange} id={`store_${store.name}`} value={props.product.quantities && props.product.quantities[props.product.quantities.map((val)=>val.store).indexOf(store._id)] && props.product.quantities[props.product.quantities.map((val)=>val.store).indexOf(store._id)].quantity || ''}/>
                </li>)}
            </ul>
            </section>
            
            </div>
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
        url = file ? `data:image/jpeg;base64,${data}`: productSVG;
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