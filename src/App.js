import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from "./Components/Login/Login";
import useUser from "./Components/Login/useUser";
import Navbar from "./Components/NavBar/NavBar";
import List from "./Components/List/List";
import AddUser from "./Components/AddUser/AddUser";
import Checking from "./Components/HistoryChecking/Checking";
import Leave from "./Components/Leave/Leave";

function App() {
  const { user, setUser, clearUser } = useUser();

  if (!user) {
    return (
      <div class="container">
        <div className="row">
          <div className="col-xs-12 col-md-12">
          </div>
        </div>
        <div className="row">
          <div className="col-xs-4 col-md-2"></div>
          <div className="col-xs-8 col-md-8">
            <Login setUser={setUser} />
          </div>
          <div className="col-xs-4 col-md-2"></div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-12">
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="container-fulid" >
      <BrowserRouter>
        <div className="row align-items-start">
          <div className="col-md-12">
            <Navbar user={user} clearUser={clearUser} />

          </div>
        </div>
        <div className="row align-items-center">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <Switch>
              <Route exact path="/AddUser">
                <AddUser user={user} />
              </Route>
              <Route exact path="/Checking">
                <Checking />
              </Route>
              <Route exact path="/Leave">
                <Leave />
              </Route>
              <Route path="/*">
                <List />
              </Route>
            </Switch>
          </div>
          <div className="col-md-2"></div>
        </div>
        <div className="row align-items-end">
          <div className="col-md-12"></div>

        </div>
      </BrowserRouter >
    </div >

  );
}

export default App;
