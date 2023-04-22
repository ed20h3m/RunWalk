import React, { useState, useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import ActivityDialog from "./ActivityDialog";
import CustomAlert from "../components/CustomAlert";
import { FacilitiesContext } from "../../context/Facilities/FacilitiesState";
import { AlertContext } from "../../context/Alert/Alert";
import Loading from "../../components/utils/Loading";

const ActivityTable = () => {
  const { GetAllFacilities, PutFacility, AllFacilities } =
    useContext(FacilitiesContext);
  const { isLoading } = useContext(AlertContext);
  useEffect(() => {
    GetAllFacilities();
  }, []);
  const initialData = {
    FirstName: "",
    LastName: "",
    Email: "",
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(initialData);
  const [alertLoadDate, setalertLoadDate] = useState(false);
  const [alert, setAlert] = useState(false);

  const handleSubmit = async () => {
    // SetEmployeeId();

    // await CreateEmployee(selectedUser);
    setShowEditModal(false);
    await GetAllFacilities();
  };
  const handleUpdate = async () => {
    // SetEmployeeId();

    await PutFacility(selectedUser.Facility, selectedUser);
    setShowEditModal(false);
    await GetAllFacilities();
  };
  const handleShowEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleShowDeleteModal = (user) => {
    setAlert(true);
    setSelectedUser(user);
  };

  const handleDelete = (user) => {
    setAlert(false);
    setSelectedUser(user);
  };

  const dataArray = [];

  for (let i = 0; i < AllFacilities.length; i++) {
    const facility = AllFacilities[i];
    const activities = facility.Activities;

    for (let j = 0; j < activities.length; j++) {
      const activity = activities[j];
      const newData = {
        _id: facility._id,
        Activity: activity.Activity,
        Duration: activity.Duration,
        Facility: activity.Facility,
        Link: facility.Link,
        Price: activity.Price,
        Capacity: facility.Capacity,
        CloseTime: facility.CloseTime,
        OpenTime: facility.OpenTime,
      };

      dataArray.push(newData);
    }
  }
  return isLoading ? (
    <Loading />
  ) : (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Activity</th>
            <th>Facility</th>
            <th>Duration</th>
            <th>Price</th>
            <th>Capacity</th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dataArray?.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.Activity}</td>
              <td>{user.Facility}</td>
              <td>{user.Duration}</td>
              <td>{user.Price}</td>
              <td>{user?.Capacity}</td>

              <td>
                <EditIcon onClick={() => handleShowEditModal(user)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ActivityDialog
        open={showEditModal}
        setOpen={setShowEditModal}
        data={selectedUser}
        setData={setSelectedUser}
        storeData={selectedUser ? handleUpdate : handleSubmit}
        alertLoadDate={alertLoadDate}
        title={selectedUser ? "Edit activity data" : "Add activity data"}
      />
      <CustomAlert
        open={alert}
        setOpen={setAlert}
        deleteData={handleDelete}
        heading="Confirm Delete"
        text="Are you sure you want to delete? This action cannot be undone and backup will be deleted."
      />
    </>
  );
};

export default ActivityTable;
