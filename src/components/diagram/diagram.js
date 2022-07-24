import * as go from "gojs";
import React, { useRef, useState, useEffect } from "react";
import { ReactDiagram } from "gojs-react";

import GenogramLayout from "../GenogramLayout";
import setupDiagram from "../GenogramLibs";
import store from "../../store";

var counterLoad = 0;

const Diagram = () => {
  const listNodeData = store((state) => state.listNodeData);
  console.log("diagram.listNodeData->", listNodeData);

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
    // console.log("cxElement", cxElement);

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
    setupDiagram(myDiagram, listNodeData, 4 /* focus on this person */);

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
      // console.log("tool", tool);
      var cmd = diagram.commandHandler;
      var hasMenuItem = false;
      function maybeShowItem(elt, pred) {
        if (pred === 1) {
          elt.style.display = "block";
          hasMenuItem = true;
        } else {
          elt.style.display = "none";
        }
      }

      // Gán giá trị vào thuộc tính của Button
      // console.log("Data của node", obj.data);
      for (let i = 1; i < 6; i++) {
        const dataObj = document.getElementById("btn-add-data" + i);
        dataObj.setAttribute("data-key", obj.data.key);
        dataObj.setAttribute("data-name", obj.data.n);
        dataObj.setAttribute("data-sex", obj.data.s);
        dataObj.setAttribute("data-father", obj.data.f);
        dataObj.setAttribute("data-mother", obj.data.m);
        dataObj.setAttribute("data-wife", obj.data.ux);
        dataObj.setAttribute("data-husband", obj.data.vir);
        dataObj.setAttribute("data-attributes", obj.data.a);
      }

      var getData = {};
      getData.key = obj.data.key;
      getData.n = obj.data.n;
      getData.s = obj.data.s;
      getData.m = obj.data.m;
      getData.f = obj.data.f;
      getData.ux = obj.data.ux;
      getData.vir = obj.data.vir;
      getData.a = obj.data.a;
      getData.bio = obj.data.bio;

      console.log("Data node", getData);

      // Xác định trường hợp nào thì hiện menu thêm con
      // menu THÊM CON
      // 1. Nếu là Bố
      // - Phải có vợ => ux có giá trị
      // 2. Nếu là Mẹ
      // - Phải có chồng => vir có giá trị
      if (obj.data.s === "M")
        if (obj.data.ux) {
          maybeShowItem(document.getElementById("add-son"), 1);
          maybeShowItem(document.getElementById("add-daughter"), 1);
        } else {
          maybeShowItem(document.getElementById("add-son"), 0);
          maybeShowItem(document.getElementById("add-daughter"), 0);
        }
      else if (obj.data.s === "F")
        if (obj.data.vir) {
          maybeShowItem(document.getElementById("add-son"), 1);
          maybeShowItem(document.getElementById("add-daughter"), 1);
        } else {
          maybeShowItem(document.getElementById("add-son"), 0);
          maybeShowItem(document.getElementById("add-daughter"), 0);
        }

      // menu THÊM VỢ/CHỒNG => Luôn luôn hiện
      // Vợ/Chồng có thể có nhiều Chồng/Vợ

      // menu THÊM BỐ/MẸ
      // Hiện thị khi f và m không có giá trị. Nếu chỉ có f hoặc m thì node này lỗi và cần phải xóa tạo lại
      if (obj.data.f && obj.data.m) maybeShowItem(document.getElementById("add-parent"), 0);
      else maybeShowItem(document.getElementById("add-parent"), 1);

      // menu XEM/SỬA/XÓA => Luôn hiện
      // Khi click vào show form cho edit thuộc tính và các giá trị của người đó, không cho thay đổi bố mẹ
      // Các trường hợp được xóa
      // - Không có con (check các node còn lại xem f có ai là key của người này không)
      // - không có vợ (check các node còn lại xem ai có ux là key của người này không)
      maybeShowItem(document.getElementById("edit-delete"), 1);

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

  return (
    <>
      {/* <ReactDiagram initDiagram={initDiagram} divClassName="diagram-component diagram-center" onModelChange={handleModelChange} /> */}
      <ReactDiagram initDiagram={initDiagram} divClassName="diagram-component diagram-center" />
    </>
  );
};

export default Diagram;
