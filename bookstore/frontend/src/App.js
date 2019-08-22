import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Routes from './Routes';
import Modal from "./components/Modal";
import DeleteModal from "./components/DeleteModal";
import UpdateModal from "./components/UpdateModal";
import GlobalStyle from './styles/global';

function App() {
  return (
    <React.Fragment>
      <Routes />
      <Modal />
      <DeleteModal />
      <UpdateModal />
      <GlobalStyle />
    </React.Fragment>
  );
}

export default App;
