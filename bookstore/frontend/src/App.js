import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal";
import DeleteModal from "./components/DeleteModal";
import UpdateModal from "./components/UpdateModal";
import Routes from './components/Routes';

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Navbar />
        <Routes />
      </BrowserRouter>
      <Modal />
      <DeleteModal />
      <UpdateModal />
    </React.Fragment>
  );
}

export default App;
