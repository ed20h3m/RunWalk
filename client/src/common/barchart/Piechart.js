import React, { useState, useEffect, useContext } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FacilitiesContext } from "../../context/Facilities/FacilitiesState";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Grid } from "@mui/material";
import convertDate from "../components/convertDate";
import CustomButton from "../components/CustomButton";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  //declare values null
  const [prevale, setVale] = useState({
    isMember: null,
    Date1: null,
    Date2: null,
  });
  //change dates

  const handleChangeDate = (name, date) => {
    setVale({ ...prevale, [name]: date });
  };
  //imoport functions for apis call
  const {
    TotalNumberOfMembers,
    TotalNumberOfNonMembers,
    GetNumberOfCustomers,
  } = useContext(FacilitiesContext);
  // saveData function calss on click save button
  const saveData = async () => {
    await GetNumberOfCustomers(
      convertDate(prevale.Date1.toDate()),
      convertDate(prevale.Date2.toDate()),
      (prevale.isMember = false)
    );
    await GetNumberOfCustomers(
      convertDate(prevale.Date1.toDate()),
      convertDate(prevale.Date2.toDate()),
      (prevale.isMember = true)
    );
  };
  //pie chart labels and dataset declared
  const data = {
    labels: ["Members", "Non Members"],
    datasets: [
      {
        label: "# ",
        data: [TotalNumberOfMembers, TotalNumberOfNonMembers],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div>
      <Grid container spacing={2} style={{ margin: "0px", with: "100%" }}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <h2 className="chart-title">Customer Types</h2>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              name="Date1"
              value={prevale?.Date1}
              onChange={(date) => {
                handleChangeDate("Date1", date);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              name="Date2"
              value={prevale?.Date2}
              onChange={(date) => {
                handleChangeDate("Date2", date);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}>
          <CustomButton text={"Save"} onClick={saveData} />
        </Grid>
      </Grid>
      <Pie data={data} />
    </div>
  );
};
export default PieChart;