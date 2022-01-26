import React from "react";
import "./style.css";
import { Grid } from "./Grid";
import { ControlPanel } from "./ControlPanel";
// import gridOptions from './gridOptions';

export default function App() {
  return (
    <div className="flex-box">
      <Grid rowCount={29} columnCount={55} startNodePosition={[13, 10]} endNodePosition={[13, 40]} />
      <ControlPanel />
    </div>
  );
}
