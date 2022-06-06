import React from "react";
import Grid from "./Grid";
import ControlPanel from "./ControlPanel";
import "../Assets/Styles/app.css";

const App = () => {
  return (
    <div className="flex-box">
      <ControlPanel />
      <Grid rowCount={29} columnCount={55} startNodePosition={[13, 10]} endNodePosition={[13, 40]} />
    </div>
  );
};

export default App;
