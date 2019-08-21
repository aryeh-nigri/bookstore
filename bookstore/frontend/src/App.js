import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Details from "./components/Details";
import Default from "./components/Default";
import Cart from "./components/Cart";
import Modal from "./components/Modal";
import DeleteModal from "./components/DeleteModal";
import UpdateModal from "./components/UpdateModal";
import BookAdministration from "./components/BooksAdministration";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";

function App() {
  return (
    <React.Fragment>
      <Navbar />
      <Switch>
        <Route exact path="/" component={ProductList} />
        <Route path="/details" component={Details} />
        <Route path="/cart" component={Cart} />
        <Route path="/booksAdministration" component={BookAdministration} />
        <Route path="/aboutUs" component={AboutUs} />
        <Route path="/contactUs" component={ContactUs} />
        <Route component={Default} />
      </Switch>
      <Modal />
      <DeleteModal />
      <UpdateModal />
    </React.Fragment>
  );
}

export default App;
