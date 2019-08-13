import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import { Jumbotron } from "reactstrap";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <Header />
          <Jumbotron>
            <Route
              exact
              path="/"
              component={Home}
            // render={props => (
            //   <React.Fragment>
            //     <h1>Main Page</h1>
            //   </React.Fragment>
            // )}
            />
            <Route path="/about" component={About} />
          </Jumbotron>
        </div>
      </div>
    </Router>
  );
}

export default App;
