import React, { useState, useContext, useEffect } from "react";
import { Table, Pagination, Button, Modal, Form } from "react-bootstrap";
import { AuthContext } from "../../context/Authentication/AuthState";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import Dialog from "./Dialog";
import CustomAlert from "../components/CustomAlert";
import { AlertContext } from "../../context/Alert/Alert";
import Loading from "../../components/utils/Loading";
const StaffTable = () => {
  const {
    Employees,
    GetEmployees,
    PutEmployee,
    SetEmployeeId,
    CreateEmployee,
  } = useContext(AuthContext);
  useEffect(() => {
    GetEmployees();
  }, []);
  const initialData = {
    FirstName: "",
    LastName: "",
    Email: "",
  };
  const { isLoading } = useContext(AlertContext);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(initialData);
  const [alertLoadDate, setalertLoadDate] = useState(false);
  const [status, setStatus] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertRevert, setAlertRevert] = useState(false);

  const handleSubmit = async () => {
    await CreateEmployee(selectedUser);
    setShowEditModal(false);
    await GetEmployees();
  };
  const handleUpdate = async () => {
    SetEmployeeId();

    await PutEmployee(selectedUser);
    setShowEditModal(false);
    await GetEmployees();
  };

  const handleShowEditModal = (user) => {
    setStatus(user ? "edit" : "add");
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleShowDeleteModal = (user) => {
    setAlert(true);
    setSelectedUser(user);
  };
  const handleShowRevertModal = (user) => {
    setAlertRevert(true);
    setSelectedUser(user);
  };

  const handleDelete = async () => {
    selectedUser.isSuspended = true;
    setAlert(false);
    await PutEmployee(selectedUser);
    await GetEmployees();
  };

  const handleDeleteDone = async () => {
    selectedUser.isSuspended = false;
    setAlertRevert(false);
    await PutEmployee(selectedUser);
    await GetEmployees();
  };

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <AddCircleOutlineOutlinedIcon
        style={{
          float: "right",
          color: "black",
          cursor: "pointer",
          marginBottom: "5px",
        }}
        onClick={() => handleShowEditModal()}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Suspended</th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Employees.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.FirstName}</td>
              <td>{user.LastName}</td>
              <td>{user.Email}</td>
              <td>{user.isSuspended ? "Yes" : "No"}</td>

              <td>
                <EditIcon onClick={() => handleShowEditModal(user)} />
                {!user.isSuspended && (
                  <DeleteIcon
                    onClick={() => handleShowDeleteModal(user)}
                    style={{ color: "red" }}
                  />
                )}
                {user.isSuspended && (
                  <DoneOutlineIcon
                    onClick={() => handleShowRevertModal(user)}
                    style={{ color: "green" }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Dialog
        open={showEditModal}
        setOpen={setShowEditModal}
        data={selectedUser}
        setData={setSelectedUser}
        storeData={status === "edit" ? handleUpdate : handleSubmit}
        alertLoadDate={alertLoadDate}
        title={status === "edit" ? "Edit staff data" : "Add staff data"}
        status={status}
      />
      <CustomAlert
        open={alert}
        setOpen={setAlert}
        deleteData={handleDelete}
        heading="Confirm Deletion"
        text="Are you sure you want to delete? This action cannot be undone and backup will be deleted."
      />
      <CustomAlert
        open={alertRevert}
        setOpen={setAlertRevert}
        deleteData={handleDeleteDone}
        heading="Confirm Activation"
        text="Are you sure you want to activate this user? This action cannot be undone and backup will be deleted."
      />
    </>
  );
};

export default StaffTable;
