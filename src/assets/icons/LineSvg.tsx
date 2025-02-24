import React from "react";

const LineSvg = ({ width = 272, height = 51, color = "#3DA229" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 272 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.5 1H189M272 1H189M189 1V20.5C189 37.0685 202.431 50.5 219 50.5H272"
        stroke={color}
      />
    </svg>
  );
};

export default LineSvg;
