import React from "react";
import { Container, Row, Col } from "react-bootstrap";
//import sidebar component
import Sidebar from "../../../components/sidebar/Sidebar";
import "./activity.css";
import ActivityTable from "../../../common/customTable/ActivityTable";
const Activity = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar" style={{ padding: "initial" }}>
          <Sidebar />
        </Col>
        <Col md={9} className="main-content">
          <ActivityTable />
        </Col>
      </Row>
    </Container>
  );
};

export default Activity;
