import React from "react";
import { Cell } from "./Cell";
import "./style.css";

export const Row = ({ i, columnCount }) => {
  return (
    <div className="row">
      {new Array(columnCount).fill().map((_, j) => (
        <Cell position={{ i, j }} key={i + "," + j} />
      ))}
    </div>
  );
};
