import * as React from "react";

// Mã nguồn js ==> "./public/genogramCode.js"

class GiaPhaDemo extends React.Component {
  render() {
    console.log("Vars global");
    return (
      <div id="sample">
        ...
        <div id="myDiagramDiv" style={{ backgroundColor: "rgb(248, 248, 248)", border: "1px solid black", width: "100%", height: "600px", position: "relative", WebkitTapHighlightColor: "rgba(255, 255, 255, 0)", cursor: "auto" }}>
          <canvas tabIndex={0} width={1317} height={1000} style={{ position: "absolute", top: "0px", left: "0px", zIndex: 2, userSelect: "none", touchAction: "none", width: "1054px", height: "598px", cursor: "auto" }}>
            This text is displayed if your browser does not support the Canvas HTML element.
          </canvas>
          <div style={{ position: "absolute", overflow: "auto", width: "1054px", height: "598px", zIndex: 1 }}>
            <div style={{ position: "absolute", width: "1px", height: "1px" }} />
          </div>
        </div>
        <p />
      </div>
    );
  }
}

export default GiaPhaDemo;
