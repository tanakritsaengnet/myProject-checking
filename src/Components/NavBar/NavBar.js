import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "./NavBar.css";
import firebase from "../../Firebase";
import { IconContext } from "react-icons";
import 'bootstrap/dist/css/bootstrap.min.css';


function NavBar({ user, clearUser }) {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const logout = (e) => {
    e.preventDefault();
    firebase.auth().signOut().then((response) => {
      clearUser();
    });
  }

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          <div className="menu-bars" onClick={showSidebar}>
            {sidebar ? (
              <FaIcons.FaTimes className="menu-icon " />
            ) : (
              <FaIcons.FaBars className="menu-icon " />
            )}
            <label>CHECKING</label>
          </div>
          <div className="navbar-nav ml-auto nav-user">
            ยินดีต้อนรับ {user.name} {user.surname}
          </div>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
            <div className="logout">
              <hr className="nav-hr" />
              <li className="nav-logout" onClick={logout}>
                <Link to={"/"}>
                  <FaIcons.FaReplyAll />
                  <span> Logout</span>
                </Link>
              </li>
            </div>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default NavBar;