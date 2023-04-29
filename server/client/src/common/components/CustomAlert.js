// import libraries and components
import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
} from "@mui/material";

const CustomAlert = ({
  open,
  setOpen,
  deleteData,
  text,
  heading,
  confirm,
  cancel,
}) => {
  /**
   * open: show or hide the dropdown
   * heading: Heading of the alert box
   * deleteData: callback for delete click
   * text: body of the dialog box
   * heading: heading of the dialog box
   */

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    deleteData();
    setOpen(false);
  };

  return (
    <Dialog
      style={{ margin: "20px", boxShadow: "none", paddingTop: 0 }}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{!heading ? "Confirm Delete" : heading}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {!text
            ? "Are you sure you want to delete this? This action cannot be undone and this entry will be deleted permanently."
            : text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color={cancel ? cancel : "success"}
          size="small"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color={confirm ? confirm : "error"}
          size="small"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomAlert;
