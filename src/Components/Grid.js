import React from "react";
import Row from "./Row";
import gridOptions from "../gridOptions";
import "../Assets/Styles/grid.css";

const Grid = ({ rowCount, columnCount, startNodePosition, endNodePosition }) => {
  const rows = new Array(rowCount).fill().map((_, i) => <Row key={i.toString()} i={i} columnCount={columnCount} />);
  gridOptions.matrix = new Array(rowCount);
  for (let i = 0; i < rowCount; ++i) {
    gridOptions.matrix[i] = new Array(columnCount);
    for (let j = 0; j < columnCount; ++j) {
      gridOptions.matrix[i][j] = { class: "unvisited", weighted: false };
    }
  }
  const [start_i, start_j] = startNodePosition;
  const [end_i, end_j] = endNodePosition;
  gridOptions.matrix[start_i][start_j].isSource = true;
  gridOptions.matrix[end_i][end_j].isDestination = true;
  gridOptions.source = [start_i, start_j];
  gridOptions.destination = [end_i, end_j];

  const handleMouseUp = async (e) => {
    if (e.button !== 0) return;
    if (gridOptions.isSourceDragged || gridOptions.isDestinationDragged) {
      gridOptions.clearPath();
      if (gridOptions.isSourceDragged) {
        const [i, j] = gridOptions.source;
        gridOptions.matrix[i][j].update({
          class: "unvisited",
          weighted: false,
          isSource: true,
          isDestination: false,
        });
      } else if (gridOptions.isDestinationDragged) {
        const [i, j] = gridOptions.destination;
        gridOptions.matrix[i][j].update({
          class: "unvisited",
          weighted: false,
          isSource: false,
          isDestination: true,
        });
      }
      if (gridOptions.animationOnDrop) {
        await gridOptions.chozenAlgorithmCallback();
      }
    }
    gridOptions.isSourceDragged = false;
    gridOptions.isDestinationDragged = false;
    gridOptions.clicked = false;
    gridOptions.wpressed = false;
  };

  const handleMouseLeave = async () => {
    if (gridOptions.isSourceDragged || gridOptions.isDestinationDragged) {
      gridOptions.clearPath();
      if (gridOptions.isSourceDragged) {
        const [i, j] = gridOptions.source;
        gridOptions.matrix[i][j].update({
          class: "unvisited",
          weighted: false,
          isSource: true,
          isDestination: false,
        });
      } else if (gridOptions.isDestinationDragged) {
        const [i, j] = gridOptions.destination;
        gridOptions.matrix[i][j].update({
          class: "unvisited",
          weighted: false,
          isSource: false,
          isDestination: true,
        });
      }
      if (gridOptions.animationOnDrop) {
        await gridOptions.chozenAlgorithmCallback();
      }
    }
    gridOptions.clicked = false;
    gridOptions.wpressed = false;
    gridOptions.isSourceDragged = false;
    gridOptions.isDestinationDragged = false;
  };

  return (
    <>
      <div
        onDragStart={(e) => {
          e.preventDefault();
        }}
        className="grid"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {rows}
      </div>
    </>
  );
};

export default Grid;
