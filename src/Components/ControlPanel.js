import React, { useEffect } from "react";
import SearchingAlgorithmButton from "./SearchingAlgorithmButton";
import MazeAlgorithmButton from "./MazeAlgorithmButton";

import gridOptions from "../gridOptions";

import sourceIcon from "../Assets/Icons/source.png";
import destinationIcon from "../Assets/Icons/destination.png";
import wallIcon from "../Assets/Icons/wall.png";
import weightIcon from "../Assets/Icons/weight.png";
import unvisitedIcon from "../Assets/Icons/unvisited.png";
import visitedIcon from "../Assets/Icons/visited.png";
import pathIcon from "../Assets/Icons/path.png";
import "../Assets/Styles/controlPanel.css";

const ControlPanel = () => {
  useEffect(() => {
    document.getElementById("speedInput").value = 200;
    document.getElementById("isAnimatedCheckBox").checked = true;
    document.getElementById("instantAnimationCheckbox").checked = true;
    gridOptions.delay = 0;

    const handleWDown = (e) => {
      if (e.key === "w") {
        gridOptions.wpressed = true;
      }
    };
    const handleWUp = (e) => {
      if (e.key === "w") {
        gridOptions.wpressed = false;
      }
    };
    window.addEventListener("keydown", handleWDown);
    window.addEventListener("keyup", handleWUp);

    return function cleanUp() {
      window.removeEventListener(handleWDown);
      window.removeEventListener(handleWUp);
    };
  });
  return (
    <div id="controlPanel">
      <div className="panel">
        <label className="panel-title">Searching Algorithms</label>
        <SearchingAlgorithmButton algorithmName={"bfs"} />
        <SearchingAlgorithmButton algorithmName={"dfs"} />
        <SearchingAlgorithmButton algorithmName={"dijkstra"} />
        <SearchingAlgorithmButton algorithmName={"astar"} />
      </div>
      <div className="panel">
        <label className="panel-title">Maze Algorithms</label>
        <MazeAlgorithmButton algorithmName={"recursiveDivision"} />
        <MazeAlgorithmButton algorithmName={"randomizedDFS"} />
        <MazeAlgorithmButton algorithmName={"binaryTree"} />
        <MazeAlgorithmButton algorithmName={"primsRandomized"} />
        <MazeAlgorithmButton algorithmName={"kruskalsRandomized"} />
      </div>
      <div className="panel">
        <label className="panel-title">Grid options</label>
        <button
          id="clearBoardBtn"
          onClick={async () => {
            gridOptions.clearBoard();
          }}
        >
          Clear Board
        </button>
        <button
          id="clearPathBtn"
          onClick={async () => {
            gridOptions.clearPath();
          }}
        >
          Clear Path
        </button>
        <div className="input-box">
          <label htmlFor="speedInput">Speed:</label>
          <input
            id="speedInput"
            type="range"
            min="0"
            max="200"
            onChange={(e) => {
              gridOptions.delay = 200 - Number(e.target.value);
            }}
          />
        </div>
        <div className="input-box">
          <label htmlFor="isAnimatedCheckBox">Animated: </label>
          <input
            onChange={() => {
              gridOptions.isAnimated = !gridOptions.isAnimated;
            }}
            id="isAnimatedCheckBox"
            type="checkbox"
          />
        </div>
        <div className="input-box">
          <label htmlFor="instantAnimationCheckbox">Insant Animation:</label>
          <input
            onChange={() => {
              gridOptions.instantAnimationOn = !gridOptions.instantAnimationOn;
            }}
            id="instantAnimationCheckbox"
            type="checkbox"
          />
        </div>
      </div>
      <div className="panel">
        <label className="panel-title">Icons</label>
        <div className="inline-block">
          <img src={sourceIcon} alt="destination.png" />
          <label>Source node</label>
          <img src={destinationIcon} alt="source.png" />
          <label>Destination node</label>
        </div>
        <div className="inline-block">
          <img src={wallIcon} alt="wall.png" />
          <label>Wall node</label>
          <img src={weightIcon} alt="source.png" />
          <label>Weighted node</label>
        </div>
        <div className="inline-block">
          <img src={unvisitedIcon} alt="unvisited.png" />
          <label>Unvisited node</label>
          <img src={visitedIcon} alt="visited.png" />
          <label>Visited node</label>
        </div>
        <div className="inline-block">
          <img src={pathIcon} alt="path.png" />
          <label>Path node</label>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
