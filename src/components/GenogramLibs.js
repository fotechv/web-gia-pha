import * as go from "gojs";

// create and initialize the Diagram.model given an array of node data representing people
// tạo và khởi tạo Diagram.model đưa ra một mảng dữ liệu nút đại diện cho mọi người
export default function setupDiagram(diagram, array, focusId) {
  diagram.model = new go.GraphLinksModel({
    // declare support for link label nodes
    // khai báo hỗ trợ cho các nút nhãn liên kết
    linkLabelKeysProperty: "labelKeys",
    // this property determines which template is used
    // thuộc tính này xác định mẫu nào được sử dụng
    nodeCategoryProperty: "s",
    // if a node data object is copied, copy its data.a Array
    // nếu một đối tượng dữ liệu nút được sao chép, hãy sao chép dữ liệu của nó. a Mảng
    copiesArrays: true,
    // create all of the nodes for people
    // tạo tất cả các nút cho mọi người
    nodeDataArray: array,
  });
  setupMarriages(diagram);
  setupParents(diagram);

  const node = diagram.findNodeForKey(focusId);
  if (node !== null) {
    diagram.select(node);
  }
}

function findMarriage(diagram, a, b) {
  // A and B are node keys
  const nodeA = diagram.findNodeForKey(a);
  const nodeB = diagram.findNodeForKey(b);
  if (nodeA !== null && nodeB !== null) {
    const it = nodeA.findLinksBetween(nodeB); // in either direction = theo cả hai hướng
    while (it.next()) {
      const link = it.value;
      // Link.data.category === "Marriage" means it's a marriage relationship
      // Link.data.category === "Marriage" có nghĩa là quan hệ hôn nhân
      if (link.data !== null && link.data.category === "Marriage") return link;
    }
  }
  return null;
}

// now process the node data to determine marriages
// bây giờ xử lý dữ liệu nút để xác định hôn nhân
function setupMarriages(diagram) {
  const model = diagram.model;
  const nodeDataArray = model.nodeDataArray;
  for (let i = 0; i < nodeDataArray.length; i++) {
    const data = nodeDataArray[i];
    const key = data.key;
    let uxs = data.ux;
    if (uxs !== undefined) {
      if (typeof uxs === "number") uxs = [uxs];
      for (let j = 0; j < uxs.length; j++) {
        const wife = uxs[j];
        const wdata = model.findNodeDataForKey(wife);
        if (key === wife || !wdata || wdata.s !== "F") {
          console.log("cannot create Marriage relationship with self or unknown person " + wife);
          continue;
        }
        const link = findMarriage(diagram, key, wife);
        if (link === null) {
          // add a label node for the marriage link
          const mlab = { s: "LinkLabel" };
          model.addNodeData(mlab);
          // add the marriage link itself, also referring to the label node
          const mdata = { from: key, to: wife, labelKeys: [mlab.key], category: "Marriage" };
          model.addLinkData(mdata);
        }
      }
    }
    let virs = data.vir;
    if (virs !== undefined) {
      if (typeof virs === "number") virs = [virs];
      for (let j = 0; j < virs.length; j++) {
        const husband = virs[j];
        const hdata = model.findNodeDataForKey(husband);
        if (key === husband || !hdata || hdata.s !== "M") {
          console.log("cannot create Marriage relationship with self or unknown person " + husband);
          continue;
        }
        const link = findMarriage(diagram, key, husband);
        if (link === null) {
          // add a label node for the marriage link
          const mlab = { s: "LinkLabel" };
          model.addNodeData(mlab);
          // add the marriage link itself, also referring to the label node
          const mdata = { from: key, to: husband, labelKeys: [mlab.key], category: "Marriage" };
          model.addLinkData(mdata);
        }
      }
    }
  }
}

// process parent-child relationships once all marriages are known
// xử lý các mối quan hệ cha mẹ - con cái sau khi tất cả các cuộc hôn nhân được biết đến
function setupParents(diagram) {
  const model = diagram.model;
  const nodeDataArray = model.nodeDataArray;
  for (let i = 0; i < nodeDataArray.length; i++) {
    const data = nodeDataArray[i];
    const key = data.key;
    const mother = data.m;
    const father = data.f;
    if (mother !== undefined && father !== undefined) {
      const link = findMarriage(diagram, mother, father);
      if (link === null) {
        // or warn no known mother or no known father or no known marriage between them
        // hoặc cảnh báo không có mẹ hoặc cha được biết hoặc không có cuộc hôn nhân nào được biết giữa họ
        console.log("unknown marriage: " + mother + " & " + father);
        continue;
      }
      const mdata = link.data;
      if (mdata.labelKeys === undefined || mdata.labelKeys[0] === undefined) continue;
      const mlabkey = mdata.labelKeys[0];
      const cdata = { from: mlabkey, to: key };
      diagram.model.addLinkData(cdata);
    }
  }
}
