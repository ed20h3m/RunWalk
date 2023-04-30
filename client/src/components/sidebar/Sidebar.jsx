import React from "react";
// import react-icons
import { RxDashboard } from "react-icons/rx";
import { FiActivity } from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { MdCardMembership } from "react-icons/md";
import { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

// import styles
import "./sidebar.css";
const Sidebar = () => {
  //usestate
  const [selected, setSelected] = useState("");
  //seleceted sidbar key store
  const handleSelect = (eventKey) => {
    setSelected(eventKey);
    if (eventKey === "logout") {
      localStorage.clear();
      window.location.href = "/";
    }
  };
  return (
    <Nav
      defaultActiveKey="/"
      className="flex-column sidebar sidebar-page"
      onSelect={handleSelect}
      style={{ background: "black", height: "100%" }}
    >
      <Nav.Item>
        <Nav.Link
          as={Link}
          to="/dashboard"
          eventKey="dashboard"
          className={selected === "dashboard" ? "selected" : ""}
        >
          <RxDashboard className="sidebar-icon" /> Dashboard
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={Link}
          to="/manager/activities"
          eventKey="activities"
          className={selected === "activities" ? "selected" : ""}
        >
          <FiActivity className="sidebar-icon" /> Activities
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={Link}
          to="/manager/staff"
          eventKey="staff"
          className={selected === "staff" ? "selected" : ""}
        >
          <HiUsers className="sidebar-icon" /> Staff
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={Link}
          to="/manager/membership"
          eventKey="membership"
          className={selected === "membership" ? "selected" : ""}
        >
          <MdCardMembership className="sidebar-icon" /> Membership
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="#" eventKey="logout">
          <MdCardMembership className="sidebar-icon" /> Log Out
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};
export default Sidebar;
