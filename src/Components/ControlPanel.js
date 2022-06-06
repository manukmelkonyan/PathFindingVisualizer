import React, { useEffect } from "react";
import { searchingAlgorithms, runAlgorithm } from "../Algorithms/searchingAlgorithms";
import { runMazeAlgorithm } from "../Algorithms/mazeAlgorithms";
import gridOptions from "../gridOptions";
import "../Assets/Styles/controlPanel.css";

const ControlPanel = () => {
  useEffect(() => {
    document.getElementById("speedInput").value = 200;
    document.getElementById("isAnimatedCheckBox").checked = true;
    document.getElementById("instantAnimationCheckbox").checked = true;
    gridOptions.delay = 0;

    document.body.addEventListener("keydown", (e) => {
      if (e.key === "w") {
        gridOptions.wpressed = true;
        gridOptions.wallToggleON = false;
      }
    });
    document.body.addEventListener("keyup", (e) => {
      if (e.key === "w") {
        gridOptions.wpressed = false;
      }
    });
  });
  return (
    <div id="controlPanel">
      <div className="panel">
        <label className="panel-title">Searching Algorithms</label>
        <button
          id="bfsBtn"
          onClick={async () => {
            gridOptions.chozenAlgorithmCallback = searchingAlgorithms.bfs;
            await runAlgorithm("bfs");
          }}
        >
          Breadth First Search
        </button>

        <button
          id="dfsBtn"
          onClick={async () => {
            gridOptions.chozenAlgorithmCallback = searchingAlgorithms.dfs;
            await runAlgorithm("dfs");
          }}
        >
          Depth First Search
        </button>
        <button
          id="dijkstraBtn"
          onClick={async () => {
            gridOptions.chozenAlgorithmCallback = searchingAlgorithms.dijkstra;
            await runAlgorithm("dijkstra");
          }}
        >
          Dijkstra's Algorithm
        </button>
        <button
          id="astarBtn"
          onClick={async () => {
            gridOptions.chozenAlgorithmCallback = searchingAlgorithms.astar;
            await runAlgorithm("astar");
          }}
        >
          A* Algorithm
        </button>
      </div>
      <div className="panel">
        <label className="panel-title">Maze Algorithms</label>
        <button
          id="recursiveDivisionBtn"
          onClick={async () => {
            gridOptions.clearBoard();
            await runMazeAlgorithm("recursiveDivision");
          }}
        >
          Recursive Division
        </button>

        <button
          id="randomizedDFSBtn"
          onClick={async () => {
            gridOptions.clearBoard();
            await runMazeAlgorithm("randomizedDFS");
          }}
        >
          Randomized DFS
        </button>
        <button
          id="binaryTreeBtn"
          onClick={async () => {
            gridOptions.clearBoard();
            await runMazeAlgorithm("binaryTree");
          }}
        >
          Binary Tree
        </button>
        <button
          id="primsRandomizedAlgorithmBtn"
          onClick={async () => {
            gridOptions.clearBoard();
            await runMazeAlgorithm("primsRandomizedAlgorithm");
          }}
        >
          Prim's randomized
        </button>
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
        <div class="inline-block">
          <img src={require("../Assets/Icons/source.png")} alt="destination.png" />
          <label>Source node</label>
          <img src={require("../Assets/Icons/destination.png")} alt="source.png" />
          <label>Destination node</label>
        </div>
        <div class="inline-block">
          <img src={require("../Assets/Icons/wall.png")} alt="wall.png" />
          <label>Wall node</label>
          <img src={require("../Assets/Icons/weight.png")} alt="source.png" />
          <label>Weighted node</label>
        </div>
        <div class="inline-block">
          <img src={require("../Assets/Icons/unvisited.png")} alt="unvisited.png" />
          <label>Unvisited node</label>
          <img src={require("../Assets/Icons/visited.png")} alt="visited.png" />
          <label>Visited node</label>
        </div>
        <div className="inline-block">
          <img src={require("../Assets/Icons/path.png")} alt="path.png" />
          <label>Path node</label>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
