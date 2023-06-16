import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

const GreenCircle = (props) => {
  return (
    <SvgIcon {...props}>
         <path fill="#00cc00" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />

    </SvgIcon>
  );
};
GreenCircle.displayName = "GreenCircle";
export default GreenCircle;
