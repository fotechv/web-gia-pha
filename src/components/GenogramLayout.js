import * as go from "gojs";

// A custom layout that shows the two families related to a person's parents
// Một bố cục tùy chỉnh hiển thị hai gia đình có liên quan đến cha mẹ của một người
export default class GenogramLayout extends go.LayeredDigraphLayout {
  constructor() {
    super();
    this.initializeOption = go.LayeredDigraphLayout.InitDepthFirstIn;
    this.spouseSpacing = 30; // minimum space between spouses = không gian tối thiểu giữa vợ / chồng
  }

  makeNetwork(coll) {
    // generate LayoutEdges for each parent-child Link
    // tạo LayoutEdges cho mỗi Liên kết cha-con
    const net = this.createNetwork();
    if (coll instanceof go.Diagram) {
      this.add(net, coll.nodes, true);
      this.add(net, coll.links, true);
    } else if (coll instanceof go.Group) {
      this.add(net, coll.memberParts, false);
    } else if (coll.iterator) {
      this.add(net, coll.iterator, false);
    }
    return net;
  }

  // internal method for creating LayeredDigraphNetwork where husband/wife pairs are represented
  // by a single LayeredDigraphVertex corresponding to the label Node on the marriage Link
  // phương thức nội bộ để tạo LayeredDigraphNetwork nơi các cặp chồng / vợ được đại diện
  // bởi một LayeredDigraphVertex tương ứng với nhãn Node trên đường kết hôn
  add(net, coll, nonmemberonly) {
    const horiz = this.direction === 0.0 || this.direction === 180.0;
    const multiSpousePeople = new go.Set();
    // consider all Nodes in the given collection
    const it = coll.iterator;
    while (it.next()) {
      const node = it.value;
      if (!(node instanceof go.Node)) continue;
      if (!node.isLayoutPositioned || !node.isVisible()) continue;
      if (nonmemberonly && node.containingGroup !== null) continue;
      // if it's an unmarried Node, or if it's a Link Label Node, create a LayoutVertex for it
      if (node.isLinkLabel) {
        // get marriage Link
        const link = node.labeledLink;
        const spouseA = link.fromNode;
        const spouseB = link.toNode;
        // create vertex representing both husband and wife
        const vertex = net.addNode(node);
        // now define the vertex size to be big enough to hold both spouses
        if (horiz) {
          vertex.height = spouseA.actualBounds.height + this.spouseSpacing + spouseB.actualBounds.height;
          vertex.width = Math.max(spouseA.actualBounds.width, spouseB.actualBounds.width);
          vertex.focus = new go.Point(vertex.width / 2, spouseA.actualBounds.height + this.spouseSpacing / 2);
        } else {
          vertex.width = spouseA.actualBounds.width + this.spouseSpacing + spouseB.actualBounds.width;
          vertex.height = Math.max(spouseA.actualBounds.height, spouseB.actualBounds.height);
          vertex.focus = new go.Point(spouseA.actualBounds.width + this.spouseSpacing / 2, vertex.height / 2);
        }
      } else {
        // don't add a vertex for any married person!
        // instead, code above adds label node for marriage link
        // assume a marriage Link has a label Node
        let marriages = 0;
        node.linksConnected.each((l) => {
          if (l.isLabeledLink) marriages++;
        });
        if (marriages === 0) {
          net.addNode(node);
        } else if (marriages > 1) {
          multiSpousePeople.add(node);
        }
      }
    }
    // now do all Links
    it.reset();
    while (it.next()) {
      const link = it.value;
      if (!(link instanceof go.Link)) continue;
      if (!link.isLayoutPositioned || !link.isVisible()) continue;
      if (nonmemberonly && link.containingGroup !== null) continue;
      // if it's a parent-child link, add a LayoutEdge for it
      if (!link.isLabeledLink) {
        const parent = net.findVertex(link.fromNode); // should be a label node
        const child = net.findVertex(link.toNode);
        if (child !== null) {
          // an unmarried child
          net.linkVertexes(parent, child, link);
        } else {
          // a married child
          link.toNode.linksConnected.each((l) => {
            if (!l.isLabeledLink) return; // if it has no label node, it's a parent-child link
            // found the Marriage Link, now get its label Node
            const mlab = l.labelNodes.first();
            // parent-child link should connect with the label node,
            // so the LayoutEdge should connect with the LayoutVertex representing the label node
            const mlabvert = net.findVertex(mlab);
            if (mlabvert !== null) {
              net.linkVertexes(parent, mlabvert, link);
            }
          });
        }
      }
    }

    while (multiSpousePeople.count > 0) {
      // find all collections of people that are indirectly married to each other
      const node = multiSpousePeople.first();
      const cohort = new go.Set();
      this.extendCohort(cohort, node);
      // then encourage them all to be the same generation by connecting them all with a common vertex
      const dummyvert = net.createVertex();
      net.addVertex(dummyvert);
      const marriages = new go.Set();
      cohort.each((n) => {
        n.linksConnected.each((l) => {
          marriages.add(l);
        });
      });
      marriages.each((link) => {
        // find the vertex for the marriage link (i.e. for the label node)
        const mlab = link.labelNodes.first();
        const v = net.findVertex(mlab);
        if (v !== null) {
          net.linkVertexes(dummyvert, v, null);
        }
      });
      // done with these people, now see if there are any other multiple-married people
      multiSpousePeople.removeAll(cohort);
    }
  }

  // collect all of the people indirectly married with a person
  // thu thập tất cả những người kết hôn gián tiếp với một người
  extendCohort(coll, node) {
    if (coll.has(node)) return;
    coll.add(node);
    node.linksConnected.each((l) => {
      if (l.isLabeledLink) {
        // if it's a marriage link, continue with both spouses
        this.extendCohort(coll, l.fromNode);
        this.extendCohort(coll, l.toNode);
      }
    });
  }

  assignLayers() {
    super.assignLayers();
    const horiz = this.direction === 0.0 || this.direction === 180.0;
    // for every vertex, record the maximum vertex width or height for the vertex's layer
    // với mọi đỉnh, ghi lại chiều rộng hoặc chiều cao của đỉnh tối đa cho lớp của đỉnh
    const maxsizes = [];
    this.network.vertexes.each((v) => {
      const lay = v.layer;
      let max = maxsizes[lay];
      if (max === undefined) max = 0;
      const sz = horiz ? v.width : v.height;
      if (sz > max) maxsizes[lay] = sz;
    });
    // now make sure every vertex has the maximum width or height according to which layer it is in,
    // and aligned on the left (if horizontal) or the top (if vertical)
    // bây giờ hãy đảm bảo rằng mọi đỉnh đều có chiều rộng hoặc chiều cao tối đa tùy theo lớp mà nó nằm trong,
    // và căn chỉnh ở bên trái (nếu nằm ngang) hoặc trên cùng (nếu dọc)
    this.network.vertexes.each((v) => {
      const lay = v.layer;
      const max = maxsizes[lay];
      if (horiz) {
        v.focus = new go.Point(0, v.height / 2);
        v.width = max;
      } else {
        v.focus = new go.Point(v.width / 2, 0);
        v.height = max;
      }
    });
    // from now on, the LayeredDigraphLayout will think that the Node is bigger than it really is
    // (other than the ones that are the widest or tallest in their respective layer).
    // từ bây giờ, LayeredDigraphLayout sẽ nghĩ rằng Node lớn hơn thực tế
    // (trừ những cái rộng nhất hoặc cao nhất trong lớp tương ứng của chúng).
  }

  commitNodes() {
    super.commitNodes();
    const horiz = this.direction === 0.0 || this.direction === 180.0;
    // position regular nodes
    // định vị các nút thông thường
    this.network.vertexes.each((v) => {
      if (v.node !== null && !v.node.isLinkLabel) {
        v.node.moveTo(v.x, v.y);
      }
    });
    // position the spouses of each marriage vertex
    // định vị các cặp vợ chồng của mỗi đỉnh hôn nhân
    this.network.vertexes.each((v) => {
      if (v.node === null) return;
      if (!v.node.isLinkLabel) return;
      const labnode = v.node;
      const lablink = labnode.labeledLink;
      // In case the spouses are not actually moved, we need to have the marriage link
      // position the label node, because LayoutVertex.commit() was called above on these vertexes.
      // Alternatively we could override LayoutVetex.commit to be a no-op for label node vertexes.
      // Trong trường hợp vợ chồng chưa thực sự chuyển đi, chúng ta cần có đường dẫn kết hôn
      // định vị nút nhãn, vì LayoutVertex.commit () đã được gọi ở trên trên các đỉnh này.
      // Ngoài ra, chúng ta có thể ghi đè LayoutVetex.commit thành không chọn cho các đỉnh nút nhãn.
      lablink.invalidateRoute();
      let spouseA = lablink.fromNode;
      let spouseB = lablink.toNode;
      if (spouseA.opacity > 0 && spouseB.opacity > 0) {
        // prefer fathers on the left, mothers on the right
        // thích các ông bố ở bên trái, các bà mẹ ở bên phải
        if (spouseA.data.s === "F") {
          // sex is female
          const temp = spouseA;
          spouseA = spouseB;
          spouseB = temp;
        }
        // see if the parents are on the desired sides, to avoid a link crossing
        // xem liệu cha mẹ có ở bên mong muốn hay không, để tránh liên kết giao nhau
        const aParentsNode = this.findParentsMarriageLabelNode(spouseA);
        const bParentsNode = this.findParentsMarriageLabelNode(spouseB);
        if (aParentsNode !== null && bParentsNode !== null && (horiz ? aParentsNode.position.x > bParentsNode.position.x : aParentsNode.position.y > bParentsNode.position.y)) {
          // swap the spouses
          // hoán đổi vợ chồng
          const temp = spouseA;
          spouseA = spouseB;
          spouseB = temp;
        }
        spouseA.moveTo(v.x, v.y);
        if (horiz) {
          spouseB.moveTo(v.x, v.y + spouseA.actualBounds.height + this.spouseSpacing);
        } else {
          spouseB.moveTo(v.x + spouseA.actualBounds.width + this.spouseSpacing, v.y);
        }
      } else if (spouseA.opacity === 0) {
        const pos = horiz ? new go.Point(v.x, v.centerY - spouseB.actualBounds.height / 2) : new go.Point(v.centerX - spouseB.actualBounds.width / 2, v.y);
        spouseB.move(pos);
        if (horiz) pos.y++;
        else pos.x++;
        spouseA.move(pos);
      } else if (spouseB.opacity === 0) {
        const pos = horiz ? new go.Point(v.x, v.centerY - spouseA.actualBounds.height / 2) : new go.Point(v.centerX - spouseA.actualBounds.width / 2, v.y);
        spouseA.move(pos);
        if (horiz) pos.y++;
        else pos.x++;
        spouseB.move(pos);
      }
    });
    // position only-child nodes to be under the marriage label node
    // định vị các nút con chỉ ở dưới nút nhãn hôn nhân
    this.network.vertexes.each((v) => {
      if (v.node === null || v.node.linksConnected.count > 1) return;
      const mnode = this.findParentsMarriageLabelNode(v.node);
      if (mnode !== null && mnode.linksConnected.count === 1) {
        // if only one child
        const mvert = this.network.findVertex(mnode);
        const newbnds = v.node.actualBounds.copy();
        if (horiz) {
          newbnds.y = mvert.centerY - v.node.actualBounds.height / 2;
        } else {
          newbnds.x = mvert.centerX - v.node.actualBounds.width / 2;
        }
        // see if there's any empty space at the horizontal mid-point in that layer
        // xem có bất kỳ khoảng trống nào ở điểm giữa nằm ngang trong lớp đó không
        const overlaps = this.diagram.findObjectsIn(
          newbnds,
          (x) => x.part,
          (p) => p !== v.node,
          true
        );
        if (overlaps.count === 0) {
          v.node.move(newbnds.position);
        }
      }
    });
  }

  findParentsMarriageLabelNode(node) {
    const it = node.findNodesInto();
    while (it.next()) {
      const n = it.value;
      if (n.isLinkLabel) return n;
    }
    return null;
  }
}
// end GenogramLayout class
