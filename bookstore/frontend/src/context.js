import React, { Component } from 'react';

import { isAuthenticated as isAuth, logout as authLogout, login as authLogin } from './services/auth';
import api from "./services/api";

const endpoint = 'http://localhost:8080/';
const BOOKS_URL = endpoint + "api/books";

const ProductContext = React.createContext();

async function getProducts(url = BOOKS_URL) {

    const response = await fetch(url, {
        method: 'GET',
    });
    const books = response.json();
    console.log(books);
    return books;
};

class ProductProvider extends Component {
    state = {
        products: [],
        detailProduct: {},
        cart: [],
        modalOpen: false,
        updateModalOpen: false,
        deleteModalOpen: false,
        addModalOpen: false,
        modalProduct: {},
        cartSubTotal: 0,
        cartTax: 0,
        cartTotal: 0,
        username: '',
        role: '',
        isAuthenticated: false,
        loginError: ''
    };

    addNewBook = async newBook => {
        console.log(`from add new book book: ${newBook}`);
        const newBookJSON = JSON.stringify(newBook);
        console.log(newBookJSON);

        const response = await fetch(BOOKS_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: newBookJSON
        });
        if (response.ok) {
            const books = response.json();
            console.log(books);
            this.setProducts();
            return books;
        }
        console.log("create fail!");

    }

    componentDidMount() {
        this.setProducts();
    }

    setProducts = async () => {
        const response = await fetch(BOOKS_URL, {
            method: 'GET',
        });
        const books = await response.json();

        let products = [];
        books.forEach(item => {
            const singleItem = { ...item };
            products = [...products, singleItem];
        });
        const detailProduct = products[0];
        const modalProduct = detailProduct;

        this.setState(() => {
            return { products, detailProduct, modalProduct };
        }, this.checkCartItems);
    };
    getItem = id => {
        const product = this.state.products.find(item => item._id === id);
        return product;
    };

    handleDetail = id => {
        const product = this.getItem(id);
        console.log(product);

        this.setState(() => {
            return { detailProduct: product };
        });
    };

    addToCart = id => {
        let tempProducts = [...this.state.products];
        const index = tempProducts.indexOf(this.getItem(id));
        const product = tempProducts[index];
        product.inCart = true;
        product.count = 1;
        const price = product.price;
        product.total = price;

        this.setState(() => {
            return {
                products: [...tempProducts],
                cart: [...this.state.cart, product],
                detailProduct: { ...product }
            };
        }, this.addTotals);
    };

    openModal = id => {
        const product = this.getItem(id);
        this.setState(() => {
            return { modalProduct: product, modalOpen: true };
        });
    };
    openAddModal = (product) => {
        this.setState(() => {
            return { modalProduct: product, addModalOpen: true };
        });
    };
    openDeleteModal = id => {
        const product = this.getItem(id);
        this.setState(() => {
            return { modalProduct: product, deleteModalOpen: true };
        });
    };
    openUpdateModal = id => {
        const product = this.getItem(id);
        this.setState(() => {
            return { modalProduct: product, updateModalOpen: true };
        });
    };

    closeModal = () => {
        this.setState(() => {
            return { modalOpen: false };
        });
    };
    closeUpdateModal = () => {
        this.setState(() => {
            return { updateModalOpen: false };
        });
    };
    closeDeleteModal = () => {
        this.setState(() => {
            return { deleteModalOpen: false };
        });
    };
    closeAddModal = () => {
        this.setState(() => {
            return { addModalOpen: false };
        });
    };
    increment = id => {
        let tempCart = [...this.state.cart];
        console.log(tempCart);
        const selectedProduct = tempCart.find(item => {
            return item._id === id;
        });
        console.log(selectedProduct);

        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        product.count = product.count + 1;
        product.total = product.count * product.price;
        // product.total += product.price; // same thing
        // product.total = product.total + product.price; // same thing
        this.setState(() => {
            return {
                cart: [...tempCart]
            };
        }, this.addTotals);
    };

    decrement = id => {
        let tempCart = [...this.state.cart];
        const selectedProduct = tempCart.find(item => {
            return item._id === id;
        });
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        product.count = product.count - 1;

        if (product.count === 0) {
            this.removeItem(id);
        } else {
            product.total = product.count * product.price;
            // product.total -= product.price; // same thing
            // product.total = product.total - product.price; // same thing
            this.setState(() => {
                return { cart: [...tempCart] };
            }, this.addTotals);
        }
    };

    getTotals = () => {
        // const subTotal = this.state.cart
        //   .map(item => item.total)
        //   .reduce((acc, curr) => {
        //     acc = acc + curr;
        //     return acc;
        //   }, 0);
        let subTotal = 0;
        this.state.cart.map(item => (subTotal += item.total));
        // 10% tax for example
        const tempTax = subTotal * 0.1;
        const tax = parseFloat(tempTax.toFixed(2));
        const total = subTotal + tax;
        return {
            subTotal,
            tax,
            total
        };
    };

    addTotals = () => {
        const totals = this.getTotals();
        this.setState(
            () => {
                return {
                    cartSubTotal: totals.subTotal,
                    cartTax: totals.tax,
                    cartTotal: totals.total
                };
            },
            () => {
                // console.log(this.state);
            }
        );
    };
    deleteFromStore = async id => {
        console.log(`from deleteFromStore id: ${id}`);

        const response = await fetch(endpoint + `api/books/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            const books = response.json();
            console.log(books);
            this.setProducts();
            return books;
        }
        console.log("delete fail!");

    }

    removeItem = id => {
        let tempProducts = [...this.state.products];
        let tempCart = [...this.state.cart];

        const index = tempProducts.indexOf(this.getItem(id));
        let removedProduct = tempProducts[index];
        removedProduct.inCart = false;
        removedProduct.count = 0;
        removedProduct.total = 0;

        tempCart = tempCart.filter(item => {
            return item._id !== id;
        });

        this.setState(() => {
            return {
                cart: [...tempCart],
                products: [...tempProducts]
            };
        }, this.addTotals);
    };

    clearCart = () => {
        this.setState(
            () => {
                return { cart: [] };
            },
            () => {
                this.setProducts();
                this.addTotals();
            }
        );
    };

    login = async (email, password) => {

        if (!email || !password) {
            this.setState(() => { return { loginError: "Please fill in email and password to login." } });
        }
        else {
            try {
                console.log("TO AQUI NO CONTEXT LOGIN");

                const response = await api.post("/api/auth/authenticate", { email, password });
                console.log("RESPONSE:");
                console.log(response);

                authLogin(response.data);

                const { role, username } = response.data.user;
                this.setState(
                    () => {
                        return { role, username, isAuthenticated: true, loginError: '' };
                    }
                );

                console.log(this.props);

                // this.props.history.push("/");

            } catch (err) {
                console.log(err);
                this.setState(() => { return { loginError: "There was a problem with login, please check your credentials." } });
            }
        }
    };

    logout = () => {
        this.setState(
            () => {
                return { role: '', username: '', isAuthenticated: false, loginError: '' };
            }
        );
        authLogout();
    };

    render() {
        return (
            <ProductContext.Provider
                value={{
                    ...this.state,
                    handleDetail: this.handleDetail,
                    addToCart: this.addToCart,
                    openModal: this.openModal,
                    openDeleteModal: this.openDeleteModal,
                    openUpdateModal: this.openUpdateModal,
                    openAddModal: this.openAddModal,
                    closeModal: this.closeModal,
                    closeDeleteModal: this.closeDeleteModal,
                    closeUpdateModal: this.closeDeleteModal,
                    closeAddModal: this.closeAddModal,
                    increment: this.increment,
                    decrement: this.decrement,
                    removeItem: this.removeItem,
                    deleteFromStore: this.deleteFromStore,
                    clearCart: this.clearCart,
                    addNewBook: this.addNewBook,
                    login: this.login,
                    logout: this.logout
                }}
            >
                {this.props.children}
            </ProductContext.Provider>
        );
    }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer, getProducts };