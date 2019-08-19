import React, {useState} from 'react';
import axios from 'axios';
import SpinnerComponent from './spinner.component';
import '../stylesheets/listing.scss';
import '../stylesheets/inventory.scss';
import '../stylesheets/detail.scss';
import productSVG from '../img/svg/product.svg';
import async from 'async';

export default class InventoryComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            products: [],
            fetching: true,
            searchString: '',
            isAddingProduct: false,
            filters: {
                minPrice: null,
                maxPrice: null,
                minQuantity: null,
                maxQuantity: null,
                categories: [],
                tags: []
            },
            newProduct: {
                quantities: []
            },
            sortBy: null
        }  
        this.componentDidMount=this.componentDidMount.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.toggleDetail = this.toggleDetail.bind(this);
        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    componentDidMount(){
        axios.get('http://localhost:3001/inventory/').then((response) => {
            if(response.status === 200){
                response.data.products.forEach(element => {
                    element.checked = false;
                });
                this.setState({products: response.data.products, categories: response.data.categories, stores: response.data.stores, fetching: false});
            }
            }).catch(err => {
                this.setState({products: [], fetching: false});
          });
    }

    handleCheck(e){
        var index = this.state.products.indexOf(this.state.products.find(product=>product._id == e.target.parentNode.lastChild.value));
        var stateBuf = this.state;
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
        e.preventDefault();
        axios.post('http://localhost:3001/inventory/new', {data:{product: this.state.newProduct}});
    }

    handleImageUpload(file){
        let {image, ...olState} = this.state.newProduct; 
        this.setState({newProduct: {
            ...olState,
            image: file
        }});
    }

    toggleDetail(){
            this.setState({isAddingProduct: !this.state.isAddingProduct}); 
    }

    handleInputChange(e){
        var target = e.target;
        var field = target.name;
        var oldState = this.state;
        if(/store/.test(target.id)){
            //FIX this thing
            var index =  oldState.newProduct['quantities'].indexOf({store: field});
            console.log(index);
            if(index ===-1)
                oldState.newProduct['quantities'].push({[field]: target.value});
            else
                oldState.newProduct['quantities'][index][field] = target.value;
        }
        else{
            
            oldState.newProduct[field] = target.value;
        }
        this.setState(oldState);
    }

    render(){
    return (this.state.fetching? <SpinnerComponent /> : (
        <div className="inventory-container">
            <h1>INVENTORY</h1>
            <ul className="button-list">
            {this.state.products.map((val)=><li key={val._id}><ProductButtonComponent product={val} handleCheck={this.handleCheck}/></li>)}
            </ul>
            <div className="button-bar">
            <button id="delete" onClick={this.handleDelete}>Delete</button>
            <button className="submit-button" onClick={this.toggleDetail}>Add Product</button>
            </div>
            {this.state.isAddingProduct ? <div onClick={this.toggleDetail} className='backdrop'> 
            <Detail 
            SubmitBar={<SubmitBar handleSubmit={this.handleAddProduct} submitName="Add"/>}
            ImageUpload={<ImageUpload imageFile={this.state.newProduct.image || ''} updateImage={this.handleImageUpload}/>}
            DetailInfoFields={<DetailInfoFields handleInputChange={this.handleInputChange} product={this.state.newProduct}
                                categories={this.state.categories} stores={this.state.stores}/>}
            /></div> : null}
        </div>
    ));
    }
}

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

function SubmitBar(props){
    return(
        <div className="detail-submit-bar">
                <input type="submit" onClick={props.handleSubmit} value={props.submitName} className="submit-button"/>   
        </div>
    );
}

function DetailInfoFields(props){
    return(
        <div className="detail-info-fields">
            <label htmlFor='name'>Name*</label>
            <input required type="text" id="name" name="name" style={{width: '100%'}} onChange={props.handleInputChange} value={props.product ? props.product.name : ''}/>
            <label htmlFor='sku'>SKU*</label>
            <input type="text" id="sku" name="sku" style={{width: '100%'}} onChange={props.handleInputChange} value={props.product ? props.product.sku : ''}/>
            <p>
            <label htmlFor='price'>Price*</label>
            <input type="number" id="price" name="price" min={0} step={0.01} onChange={props.handleInputChange} value={props.product && props.product.price}/>
            </p>
            <p>
            <label htmlFor='cost'>Cost</label>
            <input type="number" id="cost" name="cost" min={0} step={0.01} onChange={props.handleInputChange} value={props.product && props.product.cost}/> 
            </p>
            <section>
                <h3>Quantities*</h3>
            <ul className="stores-list">
                {props.stores.map((store)=>
                <li key={store._id}>
                    <label htmlFor={`store_${store.name}`}> {(''+store.name).charAt(0).toUpperCase()+store.name.slice(1)}:</label>
                        <input type='number' name={store.name} min={0} step={1} onChange={props.handleInputChange} id={`store_${store.name}`}/>
                </li>)}
            </ul>
            </section>
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
    let url = file && blobUrl(file)
      return (
        <div className="detail-image-banner" onDragOver={onDrag} onDrop={onDrop} onClick={onClick}>
            <img src={url} onClick={onClick} alt="Drop an image!"/>
            <input type = "file" onChange={onChange} accept="image/x-png,image/gif,image/jpeg" style={{display: 'none'}}/>
        </div>
        
      );
  }

function ProductButtonComponent(props){
    function handleMouseDown(e){
        if(e.target.className=='listing-button'){
            e.target.className = 'listing-button clicked';
        }
    }  
    function handleMouseUp(e){
        if(e.target.className=='listing-button clicked'){
            e.target.className = 'listing-button';
        }
    }
    return(
        <div 
        className="listing-button" 
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}>
        <input type="checkbox" onClick={props.handleCheck} onMouseDown={(e)=>e.stopPropagation()} onMouseUp={(e)=>e.stopPropagation()}/>
        <img src={productSVG} width='40px' height='40px'/>
        <p>{props.product.name}</p>
        <p>{props.product.price}</p>
        <p>{props.product.quantities.reduce((acc=0, val) => acc+val.quantity, 0)}</p>
        <p>{props.product.cost}</p>
        <p>{props.product.sku}</p>
        <input id='productID' type='hidden' value={props.product._id}/>
        </div> 
    );
}