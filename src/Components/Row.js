import React from "react";
import Cell from "./Cell";
import "../Assets/Styles/row.css";

const Row = ({ i, columnCount }) => {
  return (
    <div className="row">
      {new Array(columnCount).fill().map((_, j) => (
        <Cell position={{ i, j }} key={i + "," + j} />
      ))}
    </div>
  );
};

export default Row;
