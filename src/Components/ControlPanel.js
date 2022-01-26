import React, { useEffect } from "react";
import { searchingAlgorithms, runAlgorithm } from "../algorithms";
import { runMazeAlgorithm } from "../mazeAlgorithms";
import gridOptions from "../gridOptions";
import "../Assets/Styles/style.css";

export const ControlPanel = () => {
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
        <button
          id="bfsBtn"
          onClick={async () => {
            gridOptions.chozenAlgorithmCallback = searchingAlgorithms.bfs;
            await runAlgorithm("bfs");
          }}
        >
          BFS
        </button>

        <button
          id="dfsBtn"
          onClick={async () => {
            gridOptions.chozenAlgorithmCallback = searchingAlgorithms.dfs;
            await runAlgorithm("dfs");
          }}
        >
          DFS
        </button>
        <button
          id="dijkstraBtn"
          onClick={async () => {
            gridOptions.chozenAlgorithmCallback = searchingAlgorithms.dijkstra;
            await runAlgorithm("dijkstra");
          }}
        >
          Dijkstra's algorithm
        </button>
        <button
          id="astarBtn"
          onClick={async () => {
            gridOptions.chozenAlgorithmCallback = searchingAlgorithms.astar;
            await runAlgorithm("astar");
          }}
        >
          A *
        </button>
        <div className="verticalLine"></div>
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
        <label htmlFor="speedInput">Speed: </label>
        <input
          id="speedInput"
          type="range"
          min="0"
          max="200"
          onChange={(e) => {
            gridOptions.delay = 200 - Number(e.target.value);
          }}
        />
        <input
          onChange={() => {
            gridOptions.isAnimated = !gridOptions.isAnimated;
          }}
          id="isAnimatedCheckBox"
          type="checkbox"
        />
        <label htmlFor="isAnimatedCheckBox">Animated</label>
        <input
          onChange={() => {
            gridOptions.instantAnimationOn = !gridOptions.instantAnimationOn;
          }}
          id="instantAnimationCheckbox"
          type="checkbox"
        />
        <label htmlFor="instantAnimationCheckbox">Insant Animation</label>
      </div>
    </div>
  );
};
