import { TextField } from "@mui/material";

import InputAdornment from "@mui/material/InputAdornment";
const CustomInput = (props) => {
  return (
    <TextField
      placeholder={props.placeholder}
      error={props.error}
      helperText={props.helperText}
      fullWidth
      type={!props.type ? "text" : props.type}
      variant="outlined"
      size="small"
      minRows={3}
      maxRows={1000}
      label={props.label}
      name={props.name}
      value={props.value}
      multiline={props.multiline || props.multiline === "true"}
      disabled={props.disabled || props.disabled == "true"}
      inputProps={
        props.type === "number"
          ? { maxLength: [props.maxLength], style: { textAlign: "right" } }
          : { maxLength: [props.maxLength] }
      }
      onChange={props.onChange}
      InputProps={
        props.badge &&
        (props.type === "number"
          ? {
              endAdornment: (
                <InputAdornment position="end">{props.badge}</InputAdornment>
              ),
            }
          : {
              startAdornment: (
                <InputAdornment position="start">{props.badge}</InputAdornment>
              ),
            })
      }
    />
  );
};

export default CustomInput;
