import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import logo from "../../assets/logo.svg";
import api from "../../services/api";
import { login } from "../../services/auth";

import { Form, Container } from "./styles";
import { ProductConsumer } from '../../context';

class SignIn extends Component {

  state = {
    email: "",
    password: "",
    error: ""
  };

  // handleSignIn = async e => {
  //   e.preventDefault();
  //   const { email, password } = this.state;

  //   if (!email || !password) {
  //     this.setState({ error: "Please fill in email and password to login." });
  //   }
  //   else {
  //     try {
  //       const response = await api.post("/api/auth/authenticate", { email, password });
  //       console.log("RESPONSE:");
  //       console.log(response);
  //       login(response.data);
  //       this.props.history.push("/");
  //     } catch (err) {
  //       console.log(err);
  //       this.setState({
  //         error:
  //           "There was a problem with login, please check your credentials."
  //       });
  //     }
  //   }
  // };

  render() {
    return (
      <ProductConsumer>
        {value => {
          const { login, loginError } = value;

          return (
            <Container>
              <Form onSubmit={() => login(this.state.email, this.state.password)}>
                <img src={logo} alt="Bookstore logo" />
                {loginError && <p>{loginError}</p>}
                <input
                  type="email"
                  placeholder="E-mail"
                  onChange={e => this.setState({ email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  onChange={e => this.setState({ password: e.target.value })}
                />
                <button type="submit">Login</button>
                <hr />
                <Link to="/signup">Not a member? Register Here</Link>
              </Form>
            </Container>
          );
        }}
      </ProductConsumer>
    );
  }
}

// Só reforçando que o withRouter é um HOC que adiciona a propriedade history que possibilita mudar de página.
export default withRouter(SignIn);
