import React from "react";
import { Grid } from "./Grid";
import { ControlPanel } from "./ControlPanel";
import "../Assets/Styles/app.css";

export default function App() {
  return (
    <div className="flex-box">
      <Grid rowCount={29} columnCount={55} startNodePosition={[13, 10]} endNodePosition={[13, 40]} />
      <ControlPanel />
    </div>
  );
}
