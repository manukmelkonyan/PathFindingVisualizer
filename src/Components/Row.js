import React from "react";
import Cell from "./Cell";
import "../Assets/Styles/row.css";

const Row = ({ i, columnCount }) => {
  const cells = new Array(columnCount).fill().map((_, j) => {
    return <Cell position={{ i, j }} key={i + "," + j} />;
  });
  return <div className="row">{cells}</div>;
};

export default Row;
