import React from 'react';
import axios from 'axios';
import SpinnerComponent from './spinner.component';
import '../stylesheets/listing.scss';
import '../stylesheets/inventory.scss';
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
            }
        }  
        this.componentDidMount=this.componentDidMount.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddProduct = this.handleAddProduct.bind(this);
    }
    componentDidMount(){
        axios.get('http://localhost:3001/inventory/').then((response) => {
            if(response.status === 200){
                var prods = response.data;
                console.log(prods);
                prods.forEach(element => {
                    element.checked = false;
                });
                this.setState({products: prods, fetching: false});
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
    //TODO handle delete
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

    handleAddProduct(){
        this.setState({isAddingProduct: !this.state.isAddingProduct});
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
            <button id="add" onClick={this.handleAddProduct}>Add Product</button>
            </div>
            {this.state.isAddingProduct ? <ProductDetailOverlay exit={this.handleAddProduct}/> : null}
        </div>
    ));
    }
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

function ProductDetailOverlay(props){
    return(
        <div onClick={props.exit} className='backdrop'>
            <ProductDetail />
        </div>
    );
}

function ProductDetail(props){
    return(
    <div onClick={(e)=>e.stopPropagation()} className = 'detail-div'>


    </div>
    );
}