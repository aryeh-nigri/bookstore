import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import logo from "../../assets/logo.svg";
import api from "../../services/api";
import { login } from "../../services/auth";

import { Form, Container } from "./styles";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    error: ""
  };

  handleSignIn = async e => {
    e.preventDefault();
    const { email, password } = this.state;

    if (!email || !password) {
      this.setState({ error: "Please fill in email and password to login." });
    }
    else {
      try {
        // todo acertar endereco pro backend
        const response = await api.post("/sessions", { email, password });
        login(response.data.token);
        this.props.history.push("/");
      } catch (err) {
        this.setState({
          error:
            "There was a problem with login, please check your credentials."
        });
      }
    }
  };

  render() {
    return (
      <Container>
        <Form onSubmit={this.handleSignIn}>
          <img src={logo} alt="Bookstore logo" />
          {this.state.error && <p>{this.state.error}</p>}
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
  }
}

// Só reforçando que o withRouter é um HOC que adiciona a propriedade history que possibilita mudar de página.
export default withRouter(SignIn);
