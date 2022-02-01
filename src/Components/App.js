import React, { useEffect } from "react";
import Grid from "./Grid";
import ControlPanel from "./ControlPanel";
import "../Assets/Styles/app.css";

const App = () => {
  useEffect(() => {
    document.title = "Pathfinding & Maze Generating visualizer";
  });
  return (
    <div className="flex-box">
      <ControlPanel />
      <Grid rowCount={25} columnCount={55} startNodePosition={[11, 10]} endNodePosition={[11, 40]} />
    </div>
  );
};

export default App;
