import React from "react";

import ProductList from "../ProductList";
import Details from "../Details";
import Default from "../Default";
import Cart from "../Cart";
import BookAdministration from "../BooksAdministration";
import AboutUs from "../AboutUs";
import ContactUs from "../ContactUs";

import PrivateRoute from './PrivateRoute';

import { Route, Switch } from "react-router-dom";

const Routes = () => (
    <Switch>
        <Route exact path="/" component={ProductList} />
        <Route path="/details" component={Details} />
        <Route path="/cart" component={Cart} />
        <PrivateRoute path="/booksAdministration" component={BookAdministration} />
        <Route path="/aboutUs" component={AboutUs} />
        <Route path="/contactUs" component={ContactUs} />
        <Route component={Default} />
    </Switch>
);

export default Routes;