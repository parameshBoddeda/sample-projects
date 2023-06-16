import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

const GreenStatus = (props) => {
  return (
    <SvgIcon {...props}>
      <path fill="#3cb220" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
    </SvgIcon>
  );
};
GreenStatus.displayName = "GreenStatus";
export default GreenStatus;
