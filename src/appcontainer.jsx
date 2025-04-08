
import React from "react";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import Header from "./components/header";
import Home from "./components/home";
import Login from "./components/pages/login";


const AppContainer = function () {
  return (
    <Router basename= "/react/template">
      <>
        <Route render={(props) => <Header {...props} />} />
        <Routes>
          <Route  path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route  path="/home" component={Home} />
        </Routes>
        <Route render={(props) => <Footer {...props} />} />
      </>
    </Router>
  );
};

export default AppContainer;
