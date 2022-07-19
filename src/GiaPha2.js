// File này là chạy code convert từ file genogramCode.js sang ReactJS
import React, { useState } from "react";
import { ReactDiagram } from "gojs-react";

import * as go from "gojs";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import GenogramLayout from "./components/GenogramLayout";
import setupDiagram from "./components/GenogramLibs";

import "./App.css"; // contains .diagram-component CSS

var counterLoad = 0;
/**
 * Khởi tạo Diagram
 */
function initDiagram() {
  counterLoad += 1;
  // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
  // For details, see https://gojs.net/latest/intro/buildingObjects.html
  const $ = go.GraphObject.make;

  const myDiagram = $(go.Diagram, {
    initialAutoScale: go.Diagram.Uniform,
    "undoManager.isEnabled": true,
    // when a node is selected, draw a big yellow circle behind it
    nodeSelectionAdornmentTemplate: $(
      go.Adornment,
      "Auto",
      { layerName: "Grid" }, // the predefined layer that is behind everything else
      $(go.Shape, "Circle", { fill: "#c1cee3", stroke: null }),
      $(go.Placeholder, { margin: 2 })
    ),
    // use a custom layout, defined below
    layout: $(GenogramLayout, { direction: 90, layerSpacing: 30, columnSpacing: 10 }),
  });

  // Khai báo menu
  var cxElement = document.getElementById("contextMenu");
  const current = new Date();
  console.log("page load", counterLoad, current);
  console.log("cxElement", cxElement);

  // an HTMLInfo object is needed to invoke the code to set up the HTML cxElement
  var myContextMenu = $(go.HTMLInfo, {
    show: showContextMenu,
    hide: hideContextMenu,
  });
  // END Khai báo menu

  // determine the color for each attribute shape
  function attrFill(a) {
    switch (a) {
      case "A":
        return "#00af54"; // green
      case "B":
        return "#f27935"; // orange
      case "C":
        return "#d4071c"; // red
      case "D":
        return "#70bdc2"; // cyan
      case "E":
        return "#fcf384"; // gold
      case "F":
        return "#e69aaf"; // pink
      case "G":
        return "#08488f"; // blue
      case "H":
        return "#866310"; // brown
      case "I":
        return "#9270c2"; // purple
      case "J":
        return "#a3cf62"; // chartreuse
      case "K":
        return "#91a4c2"; // lightgray bluish
      case "L":
        return "#af70c2"; // magenta
      case "S":
        return "#d4071c"; // red
      default:
        return "transparent";
    }
  }

  // determine the geometry for each attribute shape in a male;
  // except for the slash these are all squares at each of the four corners of the overall square
  const tlsq = go.Geometry.parse("F M1 1 l19 0 0 19 -19 0z");
  const trsq = go.Geometry.parse("F M20 1 l19 0 0 19 -19 0z");
  const brsq = go.Geometry.parse("F M20 20 l19 0 0 19 -19 0z");
  const blsq = go.Geometry.parse("F M1 20 l19 0 0 19 -19 0z");
  const slash = go.Geometry.parse("F M38 0 L40 0 40 2 2 40 0 40 0 38z");
  function maleGeometry(a) {
    switch (a) {
      case "A":
        return tlsq;
      case "B":
        return tlsq;
      case "C":
        return tlsq;
      case "D":
        return trsq;
      case "E":
        return trsq;
      case "F":
        return trsq;
      case "G":
        return brsq;
      case "H":
        return brsq;
      case "I":
        return brsq;
      case "J":
        return blsq;
      case "K":
        return blsq;
      case "L":
        return blsq;
      case "S":
        return slash;
      default:
        return tlsq;
    }
  }

  // determine the geometry for each attribute shape in a female;
  // except for the slash these are all pie shapes at each of the four quadrants of the overall circle
  // xác định hình dạng cho từng hình dạng thuộc tính trong một cái;
  // ngoại trừ dấu gạch chéo, tất cả đều là hình bánh ở mỗi trong bốn góc phần tư của hình tròn tổng thể
  const tlarc = go.Geometry.parse("F M20 20 B 180 90 20 20 19 19 z");
  const trarc = go.Geometry.parse("F M20 20 B 270 90 20 20 19 19 z");
  const brarc = go.Geometry.parse("F M20 20 B 0 90 20 20 19 19 z");
  const blarc = go.Geometry.parse("F M20 20 B 90 90 20 20 19 19 z");
  function femaleGeometry(a) {
    switch (a) {
      case "A":
        return tlarc;
      case "B":
        return tlarc;
      case "C":
        return tlarc;
      case "D":
        return trarc;
      case "E":
        return trarc;
      case "F":
        return trarc;
      case "G":
        return brarc;
      case "H":
        return brarc;
      case "I":
        return brarc;
      case "J":
        return blarc;
      case "K":
        return blarc;
      case "L":
        return blarc;
      case "S":
        return slash;
      default:
        return tlarc;
    }
  }

  // two different node templates, one for each sex,
  // named by the category value in the node data object
  // hai mẫu nút khác nhau, một mẫu cho mỗi giới tính,
  // được đặt tên theo giá trị danh mục trong đối tượng dữ liệu nút
  myDiagram.nodeTemplateMap.add(
    "M", // male
    $(
      go.Node,
      "Vertical",
      { contextMenu: myContextMenu }, //KHAI BÁO Context MENU cho Node Nam
      // {
      //   contextMenu: $(go.Adornment, "Vertical", new go.Binding("itemArray", "commands"), {
      //     itemTemplate: $("ContextMenuButton", $(go.TextBlock, new go.Binding("text")), {
      //       click: function (e, button) {
      //         var cmd = button.data;
      //         var nodedata = button.part.adornedPart.data;
      //         console.log("On " + nodedata.text + "  " + cmd.text + ": " + cmd.action);
      //       },
      //     }),
      //   }),
      // },
      { locationSpot: go.Spot.Center, locationObjectName: "ICON", selectionObjectName: "ICON" },
      new go.Binding("opacity", "hide", (h) => (h ? 0 : 1)),
      new go.Binding("pickable", "hide", (h) => !h),
      $(
        go.Panel,
        { name: "ICON" },
        $(go.Shape, "Square", { width: 40, height: 40, strokeWidth: 2, fill: "white", stroke: "#919191", portId: "" }),
        $(
          go.Panel,
          {
            // for each attribute show a Shape at a particular place in the overall square
            itemTemplate: $(go.Panel, $(go.Shape, { stroke: null, strokeWidth: 0 }, new go.Binding("fill", "", attrFill), new go.Binding("geometry", "", maleGeometry))),
            margin: 1,
          },
          new go.Binding("itemArray", "a")
        )
      ),
      $(go.TextBlock, { textAlign: "center", maxSize: new go.Size(80, NaN), background: "rgba(255,255,255,0.5)" }, new go.Binding("text", "n"))
    )
  );

  myDiagram.nodeTemplateMap.add(
    "F", // female
    $(
      go.Node,
      "Vertical",
      { contextMenu: myContextMenu }, //KHAI BÁO Context MENU cho Node NỮ
      { locationSpot: go.Spot.Center, locationObjectName: "ICON", selectionObjectName: "ICON" },
      new go.Binding("opacity", "hide", (h) => (h ? 0 : 1)),
      new go.Binding("pickable", "hide", (h) => !h),
      $(
        go.Panel,
        { name: "ICON" },
        $(go.Shape, "Circle", { width: 40, height: 40, strokeWidth: 2, fill: "white", stroke: "#a1a1a1", portId: "" }),
        $(
          go.Panel,
          {
            // for each attribute show a Shape at a particular place in the overall circle
            itemTemplate: $(go.Panel, $(go.Shape, { stroke: null, strokeWidth: 0 }, new go.Binding("fill", "", attrFill), new go.Binding("geometry", "", femaleGeometry))),
            margin: 1,
          },
          new go.Binding("itemArray", "a")
        )
      ),
      $(go.TextBlock, { textAlign: "center", maxSize: new go.Size(80, NaN), background: "rgba(255,255,255,0.5)" }, new go.Binding("text", "n"))
    )
  );

  // the representation of each label node -- nothing shows on a Marriage Link
  myDiagram.nodeTemplateMap.add("LinkLabel", $(go.Node, { selectable: false, width: 1, height: 1, fromEndSegmentLength: 20 }));

  myDiagram.linkTemplate = // for parent-child relationships
    $(
      go.Link,
      {
        routing: go.Link.Orthogonal,
        corner: 5,
        layerName: "Background",
        selectable: false,
      },
      $(go.Shape, { stroke: "#424242", strokeWidth: 2 })
    );

  myDiagram.linkTemplateMap.add(
    "Marriage", // for marriage relationships
    $(go.Link, { selectable: false, layerName: "Background" }, $(go.Shape, { strokeWidth: 2.5, stroke: "#5d8cc1" /* blue */ }))
  );

  // n: name, s: sex, m: mother, f: father, ux: wife, vir: husband, a: attributes/markers
  // a: an Array of the attributes or markers that the person has
  // a: một Mảng gồm các thuộc tính hoặc điểm đánh dấu mà người đó có
  setupDiagram(
    myDiagram,
    [
      { key: 0, n: "Aaron", s: "M", m: -10, f: -11, ux: 1, a: ["C", "F", "K"] },
      { key: 1, n: "Alice", s: "F", m: -12, f: -13, a: ["B", "H", "K"] },
      { key: 2, n: "Bob", s: "M", m: 1, f: 0, ux: 3, a: ["C", "H", "L"] },
      { key: 3, n: "Barbara", s: "F", a: ["C"] },
      { key: 4, n: "Bill", s: "M", m: 1, f: 0, ux: 5, a: ["E", "H"] },
      { key: 5, n: "Brooke", s: "F", a: ["B", "H", "L"] },
      { key: 6, n: "Claire", s: "F", m: 1, f: 0, a: ["C"] },
      { key: 7, n: "Carol", s: "F", m: 1, f: 0, a: ["C", "I"] },
      { key: 8, n: "Chloe", s: "F", m: 1, f: 0, vir: 9, a: ["E"] },
      { key: 9, n: "Chris", s: "M", a: ["B", "H"] },
      { key: 10, n: "Ellie1", s: "F", m: 3, f: 2, vir: -20, a: ["E", "G"] }, //Test
      { key: 11, n: "Dan", s: "M", m: 3, f: 2, a: ["B", "J"] },
      { key: 12, n: "Elizabeth", s: "F", vir: 13, a: ["J"] },
      { key: 13, n: "David", s: "M", m: 5, f: 4, a: ["B", "H"] },
      { key: 14, n: "Emma", s: "F", m: 5, f: 4, a: ["E", "G"] },
      { key: 15, n: "Evan", s: "M", m: 8, f: 9, a: ["F", "H"] },
      { key: 16, n: "Ethan", s: "M", m: 8, f: 9, a: ["D", "K"] },
      { key: 17, n: "Eve", s: "F", vir: 16, a: ["B", "F", "L"] },
      { key: 18, n: "Emily", s: "F", m: 8, f: 9 },
      { key: 19, n: "Fred", s: "M", m: 17, f: 16, a: ["B"] },
      { key: 20, n: "Faith", s: "F", m: 17, f: 16, a: ["L"] },
      { key: 21, n: "Felicia", s: "F", m: 12, f: 13, a: ["H"] },
      { key: 22, n: "Frank", s: "M", m: 12, f: 13, a: ["B", "H"] },

      // "Aaron"'s ancestors
      { key: -10, n: "Paternal Grandfather", s: "M", m: -33, f: -32, ux: -11, a: ["A", "S"] },
      { key: -11, n: "Paternal Grandmother", s: "F", a: ["E", "S"] },
      { key: -32, n: "Paternal Great", s: "M", ux: -33, a: ["F", "H", "S"] },
      { key: -33, n: "Paternal Great", s: "F", a: ["S"] },
      { key: -40, n: "Great Uncle", s: "M", m: -33, f: -32, a: ["F", "H", "S"] },
      { key: -41, n: "Great Aunt", s: "F", m: -33, f: -32, a: ["B", "I", "S"] },

      { key: -20, n: "Uncle1", s: "M", m: -11, f: -10, ux: 10, a: ["A", "S"] },

      // "Alice"'s ancestors
      { key: -12, n: "Maternal Grandfather", s: "M", ux: -13, a: ["D", "L", "S"] },
      { key: -13, n: "Maternal Grandmother", s: "F", m: -31, f: -30, a: ["H", "S"] },
      { key: -21, n: "Aunt", s: "F", m: -13, f: -12, a: ["C", "I"] },
      { key: -22, n: "Uncle", s: "M", ux: -21 },
      { key: -23, n: "Cousin", s: "M", m: -21, f: -22 },
      { key: -30, n: "Maternal Great", s: "M", ux: -31, a: ["D", "J", "S"] },
      { key: -31, n: "Maternal Great", s: "F", m: -50, f: -51, a: ["B", "H", "L", "S"] },
      { key: -42, n: "Great Uncle", s: "M", m: -30, f: -31, a: ["C", "J", "S"] },
      { key: -43, n: "Great Aunt", s: "F", m: -30, f: -31, a: ["E", "G", "S"] },
      { key: -50, n: "Maternal Great Great", s: "F", vir: -51, a: ["D", "I", "S"] },
      { key: -51, n: "Bảo Nguyễn", s: "M", a: ["B", "H", "S"] },
      // Thêm mới
      // Chỉ Bố hoặc Mẹ thì không hiện thị được liên kết
      { key: -52, n: "Test vợ1", s: "M", ux: 10, a: ["B", "S"] },
    ],
    4 /* focus on this person */
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

  function showContextMenu(obj, diagram, tool) {
    // Show only the relevant buttons given the current state.
    console.log("Data của node", obj.qb);
    // console.log("tool", tool);
    var cmd = diagram.commandHandler;
    var hasMenuItem = false;
    // function maybeShowItem(elt, pred) {
    function maybeShowItem(elt, pred) {
      if (pred === 1) {
        elt.style.display = "block";
        hasMenuItem = true;
      } else {
        elt.style.display = "none";
      }
    }
    maybeShowItem(document.getElementById("cut"), 1);
    maybeShowItem(document.getElementById("copy"), 1);
    maybeShowItem(document.getElementById("paste"), 1);
    maybeShowItem(document.getElementById("delete"), 1);

    // Now show the whole context menu element
    if (hasMenuItem) {
      cxElement.classList.add("show-menu");
      // we don't bother overriding positionContextMenu, we just do it here:
      var mousePt = diagram.lastInput.viewPoint;
      cxElement.style.left = mousePt.x + 5 + "px";
      cxElement.style.top = mousePt.y + "px";
    }
  }

  function hideContextMenu() {
    cxElement.classList.remove("show-menu");
  }

  return myDiagram;
}

/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is dicussed below.
 */
function handleModelChange(changes) {
  // alert("GoJS model changed!");
  console.log("GoJS model changed!");
}

function handleOnClick() {
  // alert("Alo");
  console.log("StaticExample");
}

// render function...
function GiaPha2() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <ul id="contextMenu" className="menu">
        <li id="cut" className="menu-item">
          <Button id="add-children" variant="primary" className="btn form-control" onClick={handleShow}>
            Thêm Người Con
          </Button>
        </li>
        <li id="copy" className="menu-item">
          <Button id="add-marriage" variant="primary" className="btn form-control" onClick={handleShow}>
            Thêm Vợ/Chồng
          </Button>
        </li>
        <li id="paste" className="menu-item">
          <Button id="add-marriage" variant="primary" className="btn form-control" onClick={handleShow}>
            Thêm Cha/Mẹ
          </Button>
        </li>
        <li id="delete" className="menu-item">
          <Button id="add-marriage" variant="primary" className="btn form-control" onClick={handleShow}>
            Xem/Sửa/Xóa
          </Button>
        </li>
      </ul>
      ...
      <ReactDiagram initDiagram={initDiagram} divClassName="diagram-component diagram-center" onModelChange={handleModelChange} />
      ...
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>THÔNG TIN CÁ NHÂN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Thông ti của node: </Form.Label>
              <Form.Label>NGUYỄN VĂN A</Form.Label>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control type="text" autoFocus />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Check inline label="Còn sống" name="group1" type="radio" id="id1" />
              <Form.Check inline label="Đã chết" name="group1" type="radio" id="id2" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="A" />
              <Form.Check type="checkbox" label="B" />
              <Form.Check type="checkbox" label="C" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" rows={6} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GiaPha2;
