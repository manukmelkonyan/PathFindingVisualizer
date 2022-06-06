import React from "react";
import { runMazeAlgorithm, mazeAlgorithmsFullNames } from "../Algorithms/mazeAlgorithms";

const MazeAlgorithmButton = ({ algorithmName }) => {
  const handleClick = async () => {
    await runMazeAlgorithm(algorithmName);
  };
  return <button onClick={handleClick}>{mazeAlgorithmsFullNames[algorithmName]}</button>;
};

export default MazeAlgorithmButton;
