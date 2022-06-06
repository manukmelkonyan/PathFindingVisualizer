import React from "react";
import { runAlgorithm, searchingAlgorithmsFullNames } from "../Algorithms/searchingAlgorithms";

const SearchingAlgorithmButton = ({ algorithmName }) => {
  const handleClick = async () => {
    await runAlgorithm(algorithmName);
  };
  return <button onClick={handleClick}>{searchingAlgorithmsFullNames[algorithmName]}</button>;
};

export default SearchingAlgorithmButton;
