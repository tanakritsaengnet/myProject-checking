import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import "./App.css";

import Login from "./Components/Login/Login";
import useUser from "./Components/Login/useUser";
import Navbar from "./Components/NavBar/NavBar";
import List from "./Components/List/List";
import AddUser from "./Components/AddUser/AddUser";
import Checking from "./Components/HistoryChecking/Checking";
import Leave from "./Components/Leave/Leave";
import EditUser from "./Components/EditUser/EditUser";

function App() {
  const { user, setUser, clearUser } = useUser();

  if (!user) {
    return (
      <div className="App">
        <div className="outer">
          <Login setUser={setUser} />
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="outer">
        <BrowserRouter>
          <Navbar user={user} clearUser={clearUser} />
          <Switch>
            <Route exact path="/AddUser">
              <AddUser user={user} />
            </Route>
            <Route exact path="/Checking">
              <Checking />
            </Route>
            <Route exact path="/EditUser/:id">
              <EditUser />
            </Route>
            <Route path="/*">
              <List />
            </Route>
          </Switch>
        </BrowserRouter >
      </div>
    </div>

  );
}

export default App;
