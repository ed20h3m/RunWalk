import { Button } from "@mui/material";

const CustomButton = (props) => {
  /**
   * color: color of the button text
   * backgroundColor: color of the button
   * onClick: action to perform when the button is clicked
   * disabled: whether the button is enabled or disabled
   * margins: margins on the side of the button
   */
  return (
    <Button
      disabled={props.disabled}
      variant="contained"
      color={!props.color ? "primary" : props.color}
      onClick={props.onClick}
      startIcon={props.buttonImage}
      style={{
        backgroundColor: props.backgroundColor,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,
        marginBottom: props.marginBottom,
        paddingInline: props.paddingInline,
        color: props.customColor,
      }}
    >
      {props.text}
    </Button>
  );
};

export default CustomButton;
