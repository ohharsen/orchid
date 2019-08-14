import React from 'react';
import axios from 'axios';
import SpinnerComponent from './spinner.component';
import '../stylesheets/listing.scss';

export default class InventoryComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            products: [],
            fetching: true,
            searchString: '',
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
    }
    componentDidMount(){
        axios.get('http://localhost:3001/inventory/').then((response) => {
            if(response.status === 200){
                var prods = response.data;
                prods.forEach(element => {
                    element.checked = false;
                });
                this.setState({products: prods, fetching: false});
            }
            }).catch(err => {
                this.setState({products: [], fetching: false});
          });
    }

    toggleCheck(){

    }

    render(){
    return (this.state.fetching? <SpinnerComponent /> : (
        <div className="inventory-container">
            <ul className="button-list">
            {this.state.products.map((val)=><li><ProductButtonComponent product={val}/></li>)}
            </ul>
            </div>
    ));
    }
}

function ProductButtonComponent(props){
    function handleCheck(e){
        e.stopPropagation();
    }
    function handleMouseDown(e){
        e.target.className = 'listing-button clicked';
    }
    function handleMouseUp(e){
        e.target.className = 'listing-button';
    }
    return(
        <div 
        className="listing-button" 
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}>
        <input type="checkbox" onClick={handleCheck} onMouseDown={handleCheck} onMouseUp={handleCheck}/>
        <p>{props.product.name}</p>
        <p>{props.product.sku}</p>
        <p>{props.product.price}</p>
        <p>{/*props.product.quantites.reduce((acc, val) => acc+val.quantity)*/}</p>
        <p>{props.product.cost}</p>
        </div> 
    );
}

function ProductDetailComponent(props){

}