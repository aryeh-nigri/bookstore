import React, { Component } from 'react';
// import { Socket } from 'net';
import io from 'socket.io-client';

import { logout as authLogout, login as authLogin, isAuthenticated as isAuth, getName, getRole } from './services/auth';

import api from "./services/api";

const endpoint = 'http://localhost:8080/';
const BOOKS_URL = endpoint + "api/books";

const ProductContext = React.createContext();
const socket = io(endpoint);

async function getProducts(url = BOOKS_URL) {

    const response = await fetch(url, {
        method: 'GET',
    });
    const books = response.json();
    console.log(books);
    return books;
};

class ProductProvider extends Component {

    constructor(props) {
        super(props);

        this.state = {
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
            loginError: '',
            detailComments: [],
            loadingComments: false,
            addingCommentError: ''
        };
    }

    addNewBook = async newBook => {
        console.log(`from add new book book: ${newBook}`);
        const newBookJSON = JSON.stringify(newBook);
        console.log(newBookJSON);

        const response = await api.post(BOOKS_URL, {
            body: newBook
        });
        if (response.status) {
            const books = response.data;
            console.log(books);
            this.setProducts();
            return books;
        }
        else{
            console.log("create fail!");
        }
    }

    componentDidMount() {
        this.setProducts();
        this.setUser();
    }

    setUser = () => {
        if (isAuth()) {
            this.setState(
                () => {
                    return { role: getRole(), username: getName(), isAuthenticated: true };
                }
            );
        }
    };

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
        // console.log(product);
        
        this.setState(() => {
            return { detailProduct: product };
        });

        this.setComments(id);
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

        const response = await api.delete(`api/books/${id}`);
        if (response.status) {
            const books = response.data;
            console.log(books);
            this.setProducts();
            return books;
        }
        else{
        console.log("delete fail!");
        }
    }

    updateItem = async (id, price) => {
        console.log(`from updateItem id: ${id}`);
        let tempProducts = [...this.state.products];
        const index = tempProducts.indexOf(this.getItem(id));
        const product = tempProducts[index];
        product.price = price;
        const response = await api.put(`api/books/${id}`,{
        book:product,
        }
        );
        if (response.status) {
            const books = response.data;
            console.log(books);
            this.setProducts();
            return books;
        }
        else{
        console.log("update fail!");
        }
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

                const { role, name } = response.data.user;

                this.setState(
                    () => {
                        return { role, username: name, isAuthenticated: true, loginError: '' };
                    }
                );

                console.log(this.props);
                return true;
                // this.props.history.push("/");

            } catch (err) {
                console.log(err);
                this.setState(() => { return { loginError: "There was a problem with login, please check your credentials." } });
            }
        }
                    return false;
                };
                        
                
    logout= async () => {

        await api.get('/api/auth/user')
        .then(res => {
            console.log(res);
            // res.send({ ok: true, user: req.userId });
            const userId = res.data.user;
            api.put(`/api/auth/cart/${userId}`, this.state.cart)
            .then(res => {
                console.log('Cart saved successfully');
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch(err => {
            console.log(err);
        });

        
    
        this.setState(
            () => {
                return { role: '', username: '', isAuthenticated: false, loginError: '' };
            }
        ); 
                
        authLogout();
        this.clearCart();
    }; 

    likePost = (postId, liked, disliked) => {
        if(isAuth()){
            var post = this.state.detailComments.find(p => p._id === postId);
            var didLiked;

            if(!liked){
                if(!disliked){
                    post.likes += 1;
                }else{
                    post.likes += 1;
                    post.dislikes -= 1;
                }
                didLiked = true;
            }else{
                if(!disliked){
                    post.likes -= 1;
                }else{
                    // not allowed to like and dislike same post
                }
                didLiked = false;
            }
            // console.log(post);

            const newDetailComments = this.state.detailComments.map(comment => 
                comment._id === post._id ?
                post
                : comment
            );
            
            // console.log(newDetailComments);

            socket.emit("postUpdated", post);    
            
            this.setState(() => { return { detailComments: newDetailComments } });
            
            api.put(`/posts/${postId}`, post)
            // .then(post => {
            //     // const newPost = post.data;
            //     // console.log(newPost);
            // })
            .catch(err => {
                console.log(err);
                // return false;       
                // return { success: false, error: "Something went wrong while submitting form." };
            });

            return didLiked;
        }
    };

    dislikePost = (postId, liked, disliked) => {
        if(isAuth()){
            var post = this.state.detailComments.find(p => p._id === postId);
            var didDisliked;

            if(!disliked){
                if(!liked){
                    post.dislikes += 1;
                }else{
                    post.dislikes += 1;
                    post.likes -= 1;
                }
                didDisliked = true;
            }else{
                if(!liked){
                    post.dislikes -= 1;
                }else{
                    // not allowed to like and dislike same post
                }
                didDisliked = false;
            }

            const newDetailComments = this.state.detailComments.map(comment => 
                comment._id === post._id ?
                post
                : comment
                );
                
                this.setState(() => { return { detailComments: newDetailComments } });
                socket.emit("postUpdated", post);

            api.put(`/posts/${postId}`, post)
            // .then(post => {
            //     // const newPost = post.data;
            // })
            .catch(err => {
                console.log(err);
                // return false;
                // return { success: false, error: "Something went wrong while submitting form." };
            });

            return didDisliked;
        }
    };

    setComments = async bookId => {
        this.setState(() => { return { loadingComments: true } });

        // get all the comments
        await api.get(`/posts/${bookId}`)
            .then(res => {
                const posts = res.data;
                // console.log(posts);
                this.setState(() => { return { detailComments: posts, loadingComments: false } });
            })
            .catch(err => {
                console.log(err);
                this.setState(() => { return { loadingComments: false } });
            });

        socket.on('postReceived', post => {
            console.log("postReceived");
            // console.log(post);
            if(post.bookId === bookId){
                this.setState(() => { return { detailComments: [post, ...this.state.detailComments] } });
            }
        });

        socket.on('updateReceived', post => {
            console.log("updateReceived");
            // console.log(post);
            if(post.bookId === bookId){
                const newDetailComments = this.state.detailComments.map(comment => 
                    comment._id === post._id ?
                    post
                    : comment
                );
    
                this.setState(() => { return { detailComments: newDetailComments } });
            }
        });
    };

    addComment = comment => {
        if(comment.message !== ''){
            comment.name = this.state.username;
            comment.bookId = this.state.detailProduct._id;

            api.post('/posts', comment)
            .then(post => {
                const newPost = post.data;

                this.setState(() => { return { detailComments: [newPost, ...this.state.detailComments], loadingComments: false } });
                socket.emit("newPost", newPost);

                // return { success: true };
            })
            .catch(err => {
                console.log(err);
                return { success: false, error: "Something went wrong while submitting form." };        
            });

            return { success: true };
        }
        else{
            return { success: false, error: "All fields are required." };
        }
    };
            
                render() {
            
        return (
            <ProductContext.Provider
                value={{
                    ...this.state,
                    handleDetail: this.handleDetail,
                    addToCart: this.addToCart,
                    openModal: this.openModal,
                    openDeleteModal:  this.openDeleteModal,
                    openUpdateModal:  this.openUpdateModal,
                    openAddModal: this.openAddModal,
                    closeModal: this.closeModal,
                    closeDeleteModal: this.closeDeleteModal,
                    closeUpdateModal: this.closeUpdateModal,
                    closeAddModal: this.closeAddModal,
                    increment: this.increment,
                    decrement: this.decrement,
                    removeItem: this.removeItem,
                    deleteFromStore: this.deleteFromStore,
                    updateItem: this.updateItem,
                    clearCart: this.clearCart,
                    addNewBook: this.addNewBook,
                    login: this.login,
                    logout: this.logout,
                    likePost: this.likePost,
                    dislikePost: this.dislikePost,
                    getComments: this.getComments,
                    addComment: this.addComment,
                }}
            >
                {this.props.children}
            </ProductContext.Provider>
        );
    }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer, getProducts };