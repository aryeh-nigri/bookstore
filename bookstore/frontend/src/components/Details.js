import React from "react";
import { ProductConsumer } from "../context";
import { ButtonContainer } from "./Button";
import { Link } from "react-router-dom";
import Posts from "./Posts";
import './Details.css';

export default function Details() {

    return (
        <ProductConsumer>
            {value => {
                console.log(value);

                const {
                    _id,
                    author,
                    image_url,
                    description,
                    price,
                    title,
                    inCart
                } = value.detailProduct;

                return (
                    <div id="parentDiv">
                        <div className="container py-5" id="topDiv">
                            {/* title */}
                            <div className="row">
                                <div className="col-10 mx-auto text-center text-slanted text-blue my-5">
                                    <h1>{title}</h1>
                                </div>
                            </div>
                            {/* end of title */}
                            <div className="row">
                                <div className="col-10 mx-auto col-md-6 my-3">
                                    <img src={image_url} className="img-fluid" alt="" />
                                </div>
                                {/* product info */}
                                <div className="col-10 mx-auto col-md-6 my-3 text-capitalize">
                                    <h1>title : {title}</h1>
                                    <h4 className="text-title text-uppercase text-muted mt-3 mb-2">
                                        Author : <span className="text-uppercase">{author}</span>
                                    </h4>
                                    <h4 className="text-blue">
                                        <strong>
                                            price : <span>$</span>
                                            {price}
                                        </strong>
                                    </h4>
                                    <p className="text-capitalize font-weight-bold mt-3 mb-0">
                                        some info about product :
                  </p>
                                    <p className="text-muted lead">{description}</p>
                                    {/* buttons */}
                                    <div>
                                        <Link to="/">
                                            <ButtonContainer>back to products</ButtonContainer>
                                        </Link>
                                        <ButtonContainer
                                            cart
                                            disabled={inCart ? true : false}
                                            onClick={() => {
                                                value.addToCart(_id);
                                                value.openModal(_id);
                                            }}
                                        >
                                            {inCart ? "in cart" : "add to cart"}
                                        </ButtonContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="bottomDiv">
                            <Posts />
                        </div>
                    </div>
                );
            }}
        </ProductConsumer>
    );
}
