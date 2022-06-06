import React, { useState } from "react";
import gridOptions from "../gridOptions";
import "../Assets/Styles/cell.css";

const Cell = ({ position: { i, j } }) => {
  const [options, setOptions] = useState({
    class: gridOptions.matrix[i][j].class,
    weighted: gridOptions.matrix[i][j].weighted,
    isSource: gridOptions.matrix[i][j].isSource,
    isDestination: gridOptions.matrix[i][j].isDestination,
  });
  gridOptions.matrix[i][j].update = setOptions;
  gridOptions.matrix[i][j].class = options.class;
  gridOptions.matrix[i][j].weighted = options.weighted;
  gridOptions.matrix[i][j].isSource = options.isSource;
  gridOptions.matrix[i][j].isDestination = options.isDestination;

  let classList = "cell " + (options.isSource ? "source " : "") + (options.isDestination ? "destination " : "");
  if (gridOptions.isSourceDragged || gridOptions.isDestinationDragged || !gridOptions.isAnimated) {
    // if animation is turned off or source / destination are being dragged (and dropped), then set
    // classes without "-animated" suffixes for rendering WITHOUT animation
    classList += options.class + (options.weighted ? " weight " : "");
  } else {
    // else add "-animated" suffix to the end of the animated classes for rendering WITH animation
    classList += `${options.class}-animated ` + (options.weighted ? "weight-animated " : "");
  }

  const handleMouseDown = (e) => {
    if (e.button !== 0 || gridOptions.animationLaunched) return;

    gridOptions.clicked = true;

    if (gridOptions.matrix[i][j].isSource) {
      gridOptions.isSourceDragged = true;
    } else if (gridOptions.matrix[i][j].isDestination) {
      gridOptions.isDestinationDragged = true;
    } else {
      if (!gridOptions.wpressed) {
        setOptions({
          ...options,
          weighted: false,
          class: options.class === "wall" ? "unvisited" : "wall",
        });
      } else if (gridOptions.wpressed) {
        setOptions({
          ...options,
          class: "unvisited",
          weighted: !options.weighted,
        });
      }
    }
  };

  const handleMouseOver = async () => {
    if (!gridOptions.clicked || gridOptions.matrix[i][j].isSource || gridOptions.matrix[i][j].isDestination) return;

    if (gridOptions.isSourceDragged) {
      gridOptions.clearPath();
      const [prevSource_i, prevSource_j] = gridOptions.source;
      const prevSourceOptions = gridOptions.matrix[prevSource_i][prevSource_j];

      gridOptions.matrix[prevSource_i][prevSource_j].update({
        ...prevSourceOptions,
        isSource: false,
      });
      gridOptions.source = [i, j];

      gridOptions.matrix[i][j].update({
        ...options,
        isSource: true,
      });
    } else if (gridOptions.isDestinationDragged) {
      gridOptions.clearPath();
      const [prevDestination_i, prevDestination_j] = gridOptions.destination;
      const prevDestinationOptions = gridOptions.matrix[prevDestination_i][prevDestination_j];
      gridOptions.matrix[prevDestination_i][prevDestination_j].update({
        ...prevDestinationOptions,
        isDestination: false,
      });
      gridOptions.destination = [i, j];
      gridOptions.matrix[i][j].update({
        ...options,
        isDestination: true,
      });
    } else if (gridOptions.wpressed) {
      // drawing a weighted node
      setOptions({
        ...options,
        class: "unvisited",
        weighted: !options.weighted,
      });
    } else {
      // drawing a wall
      setOptions({
        ...options,
        weighted: false,
        class: options.class === "wall" ? "unvisited" : "wall",
      });
    }
  };

  return (
    <div
      id={i + "," + j}
      onDragStart={(e) => {
        e.preventDefault();
      }}
      className={classList}
      onMouseDown={handleMouseDown}
      onMouseOver={handleMouseOver}
    />
  );
};

export default Cell;
