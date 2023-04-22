import React from "react";
import "./CustomerProfilePage.css";

const InputItem = ({
  name,
  label,
  attribute,
  type = "text",
  onChange,
  inEdit,
}) => {
  return (
    <div className="input-item">
      <div>
        <label htmlFor="">{label}</label>
        <input
          onChange={onChange}
          type={type}
          name={name}
          value={attribute}
          disabled={!inEdit}
        ></input>
      </div>
    </div>
  );
};

export default InputItem;
