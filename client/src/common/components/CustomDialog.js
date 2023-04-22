import {
  AppBar,
  Toolbar,
  Typography,
  DialogActions,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomDialog = ({
  open,
  setOpen,
  title,
  content,
  setData,
  maxWidth,
  action,
}) => {
  const handleClose = () => {
    setOpen(false);

    if (setData) {
      setData({});
    }
  };

  return (
    <Dialog
      style={{ margin: "20px", boxShadow: "none", paddingTop: 0 }}
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={maxWidth ? maxWidth : "md"}
    >
      <AppBar position="static" elevation={0}>
        <Toolbar
          className="app-flex-between w-full"
          style={{
            borderBottom: 0,
            display: "flex",
            justifyContent: "space-between",
            background: "black",
          }}
        >
          <Typography variant="subtitle1" color="inherit">
            {title}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon
              className="app-dialog-close"
              style={{ color: "white" }}
            />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent style={{ padding: "24px" }}>{content}</DialogContent>

      <DialogActions className="justify-end pb-20 pt-0">
        <div style={{ padding: "0 16px" }}>{action}</div>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
