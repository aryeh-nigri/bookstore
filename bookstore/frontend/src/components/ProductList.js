import React, { Component } from "react";
import Product from "./Product";
import Title from "./Title";
import { storeProducts } from "../data";
import styled from "styled-components";
import { ProductConsumer, getProducts } from "../context";

export default class ProductList extends Component {

    state = {
        //products: storeProducts
        products: getProducts()
    };
    
    googleBooks =  async function (params) {
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=harry+potter&intitle=harry+potter&key=AIzaSyD2QWE7fuDymvvLUCFwOfN7CHZ2w8sEmDI', {
            method: 'GET',
        });           
        const res = response.json();
        console.log(res);
        
        return res;
    }
        
    render() {
        this.googleBooks();
        return (
            <React.Fragment>
                <ProductWrapper className="py-5">
                    <div className="container">
                        <Title name="our" title="products" />
                        <div className="row">
                            <ProductConsumer>
                                {value => {
                                    const products = value.products;
                                    
                                    return products.map(product => {
                                        return <Product key={product.id} product={product} />;
                                    });
                                }}
                            </ProductConsumer>
                        </div>
                    </div>
                </ProductWrapper>
            </React.Fragment>
        );
    }
}

const ProductWrapper = styled.section``;
