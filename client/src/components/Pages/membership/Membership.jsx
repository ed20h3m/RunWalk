import React from "react";
import { Container, Row, Col } from "react-bootstrap";
//import sidebar component
import Sidebar from "../../sidebar/Sidebar";
import MembershipTable from "../../../common/customTable/MembershipTable";
import "./membership.css";
const Membership = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar" style={{ padding: "initial" }}>
          <Sidebar />
        </Col>
        <Col md={9} className="main-content">
          <MembershipTable />
        </Col>
      </Row>
    </Container>
  );
};

export default Membership;