import React, { useEffect, useContext, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
//import sidebar component
import Sidebar from "../../../components/sidebar/Sidebar";
import Barchart from "../../../common/barchart/Barchart";
import Piechart from "../../../common/barchart/Piechart";
import { FacilitiesContext } from "../../../context/Facilities/FacilitiesState";
import convertDate from "../../../common/components/convertDate";
import "./dashboard.css";
const Dashboard = () => {
  const [profit, setProfit] = React.useState("");
  const [prevale, setVale] = useState({});
  const {
    TotalBookedSessions,
    GetBookedSessions,
    TotalProfitMadeAllFacilities,
    TotalProfitMadeAllActivities,
    TotalProfitAllActivities,
    TotalProfitAllFacilities,
  } = useContext(FacilitiesContext);

  const options = {
    plugins: {},
    responsive: true,
    interaction: {
      intersect: false,
    },
  };

  const data = TotalBookedSessions.map((obj, index) => ({
    label: obj.Facility,
    data: obj.count,
  }));
  const facilitylabels = [TotalBookedSessions.map((obj) => obj.Facility)];
  const facility = {
    labels: facilitylabels[0],

    datasets: [
      {
        label: "Activities",
        data: TotalBookedSessions?.map((obj) => obj.count),
        backgroundColor: ["black"], // Add an array of colors here
        borderWidth: 1, // Example border width
      },
    ],
  };
  const Leadsperstep = {
    labels: TotalProfitAllFacilities?.map((obj) => obj.Facility),
    datasets: [
      {
        label: "Total Profit Facilities",
        data: TotalProfitAllFacilities?.map((obj) => obj.Total),
        backgroundColor: ["black"], // Add an array of colors here
        borderWidth: 1, // Example border width
      },
    ],
  };

  const Leadsperstepdata = {
    labels: TotalProfitAllActivities?.map((obj) => obj.Activity),
    datasets: [
      {
        label: "Total Profit Activities",
        data: TotalProfitAllActivities?.map((obj) => obj.Total),
        backgroundColor: ["black"], // Add an array of colors here
        borderWidth: 1, // Example border width
      },
    ],
  };

  const storeData = () => {
    if (prevale?.profit === "facility") {
      TotalProfitMadeAllFacilities(
        convertDate(prevale.Date1.toDate()),
        convertDate(prevale.Date2.toDate())
      );
      setVale({ profit: null });
    }
    if (prevale?.profit === "activity") {
      TotalProfitMadeAllActivities(
        convertDate(prevale.Date1.toDate()),
        convertDate(prevale.Date2.toDate())
      );
      setVale({ profit: null });
    }
    if (prevale?.profit != "activity" && prevale?.profit != "facility") {
      GetBookedSessions(
        convertDate(prevale.Date1.toDate()),
        convertDate(prevale.Date2.toDate())
      );
      setVale({ profit: null });
    }
  };
  return (
    <Container fluid>
      <Row style={{ width: "inherit" }}>
        <Col
          lg={2}
          md={2}
          sm={2}
          xs={2}
          className="sidebar"
          style={{ padding: "initial" }}
        >
          <Sidebar />
        </Col>
        <Col lg={6} md={6} sm={10} xs={10}>
          <div className="main-content">
            <Barchart
              data={facility}
              options={options}
              title="Activities"
              setProfit={setProfit}
              profit={profit}
              setVale={setVale}
              prevale={prevale}
              storeData={storeData}
            />
          </div>
          <div className="main-content" style={{ margin: "30px 0px" }}>
            <Barchart
              data={
                prevale.profit === "facility" ? Leadsperstep : Leadsperstepdata
              }
              options={options}
              setProfit={setProfit}
              profit={profit}
              setVale={setVale}
              prevale={prevale}
              storeData={storeData}
            />
          </div>
        </Col>
        <Col
          lg={4}
          md={4}
          sm={10}
          xs={10}
          className="main-content"
          style={{ marginTop: "20px" }}
        >
          <div>
            <Piechart />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
