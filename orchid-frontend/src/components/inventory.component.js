import React from 'react';
import axios from 'axios';
import SpinnerComponent from './spinner.component';

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
                this.setState({products: response.data, fetching: false});
            }
            }).catch(err => {
                this.setState({products: [], fetching: false});
          });
    }

    render(){
    return (this.state.fetching? <SpinnerComponent /> : (
        <div className="inventory-container">

        </div>
    ));
    }
}

function ProductButtonComponent(props){

}

function ProductDetailComponent(props){

}