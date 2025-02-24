import React from "react";

const StraightLine = ({ width = 257, height = 2, color = "#3DA229" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 257 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0.5 1H173.5H256.5" stroke={color} />
    </svg>
  );
};

export default StraightLine;
