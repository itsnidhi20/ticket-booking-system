import React from "react";

const OTPInput = ({ value, onChange }: any) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={6}
    />
  );
};

export default OTPInput;
