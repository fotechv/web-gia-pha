import React from "react";

import * as go from "gojs";
import { ReactDiagram } from "gojs-react";

import GenogramLayout from "./components/GenogramLayout";
import setupDiagram from "./components/GenogramLibs";
import ModalDemo1 from "./components/ModalDemo1";

import "./App.css"; // contains .diagram-component CSS

function initDiagram() {
  // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
  // For details, see https://gojs.net/latest/intro/buildingObjects.html
  const $ = go.GraphObject.make; // for conciseness in defining templates

  const myDiagram = $(go.Diagram, {
    "undoManager.isEnabled": true,
  });

  // This is the actual HTML context menu:
  var cxElement = document.getElementById("contextMenu");
  console.log("cxElement", cxElement);

  // an HTMLInfo object is needed to invoke the code to set up the HTML cxElement
  var myContextMenu = $(go.HTMLInfo, {
    show: showContextMenu,
    hide: hideContextMenu,
  });

  // define a simple Node template (but use the default Link template)
  myDiagram.nodeTemplate = $(
    go.Node,
    "Auto",
    { contextMenu: myContextMenu },
    $(
      go.Shape,
      "RoundedRectangle",
      // Shape.fill is bound to Node.data.color
      new go.Binding("fill", "color")
    ),
    $(
      go.TextBlock,
      { margin: 3 }, // some room around the text
      // TextBlock.text is bound to Node.data.key
      new go.Binding("text", "key")
    )
  );

  // create the model data that will be represented by Nodes and Links
  myDiagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", color: "#f38181" },
      { key: "Beta", color: "#eaffd0" },
      { key: "Gamma", color: "#95e1d3" },
      { key: "Delta", color: "#fce38a" },
    ],
    [
      { from: "Alpha", to: "Beta" },
      { from: "Alpha", to: "Gamma" },
      { from: "Beta", to: "Beta" },
      { from: "Gamma", to: "Delta" },
      { from: "Delta", to: "Alpha" },
    ]
  );

  myDiagram.contextMenu = myContextMenu;

  // We don't want the div acting as a context menu to have a (browser) context menu!
  cxElement.addEventListener(
    "contextmenu",
    (e) => {
      e.preventDefault();
      return false;
    },
    false
  );

  function hideCX() {
    if (myDiagram.currentTool instanceof go.ContextMenuTool) {
      myDiagram.currentTool.doCancel();
    }
  }

  function showContextMenu(obj, diagram, tool) {
    // Show only the relevant buttons given the current state.
    var cmd = diagram.commandHandler;
    var hasMenuItem = false;
    function maybeShowItem(elt, pred) {
      if (pred) {
        elt.style.display = "block";
        hasMenuItem = true;
      } else {
        elt.style.display = "none";
      }
    }
    maybeShowItem(document.getElementById("cut"), cmd.canCutSelection());
    maybeShowItem(document.getElementById("copy"), cmd.canCopySelection());
    maybeShowItem(document.getElementById("paste"), cmd.canPasteSelection(diagram.toolManager.contextMenuTool.mouseDownPoint));
    maybeShowItem(document.getElementById("delete"), cmd.canDeleteSelection());
    maybeShowItem(document.getElementById("color"), obj !== null);

    // Now show the whole context menu element
    if (hasMenuItem) {
      cxElement.classList.add("show-menu");
      // we don't bother overriding positionContextMenu, we just do it here:
      var mousePt = diagram.lastInput.viewPoint;
      cxElement.style.left = mousePt.x + 5 + "px";
      cxElement.style.top = mousePt.y + "px";
    }

    // Optional: Use a `window` onPointerDown listener with event capture to
    //           remove the context menu if the user clicks elsewhere on the page
    window.addEventListener("onPointerDown", hideCX, true);
  }

  function hideContextMenu() {
    cxElement.classList.remove("show-menu");
    // Optional: Use a `window` onPointerDown listener with event capture to
    //           remove the context menu if the user clicks elsewhere on the page
    window.removeEventListener("onPointerDown", hideCX, true);
  }

  return myDiagram;
}

// This is the general menu command handler, parameterized by the name of the command.
function cxcommand(event, val) {
  console.log("event", event);
  console.log("val", val);
  //   if (val === undefined) val = event.currentTarget.id;
  //   var diagram = myDiagram;
  //   switch (val) {
  //     case "cut":
  //       console.log("Lệnh cut");
  //       diagram.commandHandler.cutSelection();
  //       break;
  //     case "copy":
  //       diagram.commandHandler.copySelection();
  //       break;
  //     case "paste":
  //       diagram.commandHandler.pasteSelection(diagram.toolManager.contextMenuTool.mouseDownPoint);
  //       break;
  //     case "delete":
  //       diagram.commandHandler.deleteSelection();
  //       break;
  //     case "color": {
  //       var color = window.getComputedStyle(event.target)["background-color"];
  //       changeColor(diagram, color);
  //       break;
  //     }
  //   }
  //   diagram.currentTool.stopTool();
}

// A custom command, for changing the color of the selected node(s).
function changeColor(diagram, color) {
  // Always make changes in a transaction, except when initializing the diagram.
  diagram.startTransaction("change color");
  diagram.selection.each((node) => {
    if (node instanceof go.Node) {
      // ignore any selected Links and simple Parts
      // Examine and modify the data, not the Node directly.
      var data = node.data;
      // Call setDataProperty to support undo/redo as well as
      // automatically evaluating any relevant bindings.
      diagram.model.setDataProperty(data, "color", color);
    }
  });
  diagram.commitTransaction("change color");
}

function handleModelChange(changes) {
  // alert("GoJS model changed!");
  console.log("Call handleModelChange");
}

function handleOnClick() {
  // alert("Alo");
  console.log("StaticExample");
}

// render function...
function ContextMenus() {
  return (
    <div>
      <ul id="contextMenu" className="menu">
        <li id="cut" className="menu-item" onClick={handleOnClick}>
          Cut
        </li>
        <li id="copy" className="menu-item">
          Copy
        </li>
        <li id="paste" className="menu-item">
          Paste
        </li>
        <li id="delete" className="menu-item">
          Delete
        </li>
        <li id="color" className="menu-item">
          Color
          <ul className="menu">
            <li className="menu-item" style={{ backgroundColor: "#f38181" }} onPointerDown={cxcommand("", "red", initDiagram)}>
              Red
            </li>
          </ul>
        </li>
      </ul>
      ...
      <ReactDiagram initDiagram={initDiagram} divClassName="diagram-component diagram-center" onModelChange={handleModelChange} />
      ...
    </div>
  );
}

export default ContextMenus;
