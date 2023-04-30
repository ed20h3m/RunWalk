import React, { useState, useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";

import { FacilitiesContext } from "../../context/Facilities/FacilitiesState";
import MembershipDialog from "./MembershipDialog";

const MembershipTable = () => {
  // fucntions for api calls
  const { GetInfo, PutInfo, Info } = useContext(FacilitiesContext);
  //declare values
  const initialData = {
    FirstName: "",
    LastName: "",
    Email: "",
  };
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(initialData);
  const [alertLoadDate, setalertLoadDate] = useState(false);

  // render comoponet when open membership page
  useEffect(() => {
    GetInfo();
  }, []);
  // update function
  const handleUpdate = async () => {
    // SetEmployeeId();

    await PutInfo(selectedUser);
    setShowEditModal(false);
    GetInfo();
  };
  // oppen dialog with selected user values
  const handleShowEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Annual Price</th>
            <th>Monthly Price</th>
            <th>Discount</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{1}</td>
            <td>{Info?.AnnualPrice}</td>
            <td>{Info?.MonthlyPrice}</td>
            <td>{Info?.Discount}</td>
            <td>
              <EditIcon onClick={() => handleShowEditModal(Info)} />
            </td>
          </tr>
        </tbody>
      </Table>

      <MembershipDialog
        open={showEditModal}
        setOpen={setShowEditModal}
        data={selectedUser}
        setData={setSelectedUser}
        storeData={handleUpdate}
        alertLoadDate={alertLoadDate}
        title={"Edit Membership data"}
      />
    </>
  );
};

export default MembershipTable;