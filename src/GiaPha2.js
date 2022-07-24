// File này là chạy code convert từ file genogramCode.js sang ReactJS
import "./App.css"; // contains .diagram-component CSS
import React, { useRef, useState, useEffect } from "react";
import { ReactDiagram } from "gojs-react";

import * as go from "gojs";

import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import GenogramLayout from "./components/GenogramLayout";
import setupDiagram from "./components/GenogramLibs";

import { doc, collection, query, orderBy, limit, onSnapshot, getDocs, addDoc, setDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";
import { db } from "./database/firebaseConfig";
import { listNodeArray } from "./database/firestoreDao";

import Diagram from "./components/diagram/diagram";
import store from "./store";
import ModalAddSon from "./components/ModalAddSon";

function handleOnClick() {
  // alert("Alo");
  console.log("StaticExample");
}

// render function...
function GiaPha2() {
  // Cách 1 lấy value sử dụng useRef (add vào attribute button ref={ref})
  // const ref = useRef(null);
  const [newId, setNewId] = useState(); //Xác định ID mới nhất để tạo key cho người thêm mới
  const [show, setShow] = useState(false);
  const [data, setData] = useState({}); //Lưu data khi right click vào người nào đó
  const [getDataFireStore, setGetDataFireStore] = useState([]);
  const listNodeData = store((state) => state.listNodeData);
  const changeListNodeData = store((state) => state.changeListNodeData);
  const usersCollection = collection(db, "biography");

  // const onSubmit = (data1) => console.log("GiaPha2.data1", data1);

  useEffect(() => {
    const getUsers = async () => {
      // const data = await getDocs(usersCollection);
      const data = await getDocs(query(usersCollection, orderBy("createdAt")));
      setGetDataFireStore(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  useEffect(() => {
    changeListNodeData({ listNodeData: getDataFireStore });
  });

  // // THAM KHẢO DANH SÁCH TASKS
  // useEffect(() => {
  //   const colTasks = collection(db, "tele_bot_tasks");
  //   const q = query(colTasks, orderBy("runAt", "desc"));

  //   const unsub = onSnapshot(q, (querySnapshot) => {
  //     let taskArray = [];

  //     querySnapshot.forEach((doc) => {
  //       let docData = doc.data();

  //       taskArray.push({
  //         ...docData,
  //         id: doc.id,
  //       });
  //     });

  //     setTasks(taskArray);
  //   });

  //   return () => unsub();
  // }, []);

  useEffect(() => {
    const col = collection(db, "biography");
    // const q = query(col);
    const q = query(col, orderBy("createdAt", "desc"), limit(1));
    onSnapshot(q, (querySnapshot) => {
      // setNewId(querySnapshot.size + 1);

      querySnapshot.forEach((doc) => {
        setNewId(parseInt(doc.id) + 1);
        // console.log(doc.id, " => ", doc.data());
        // console.log(doc.id, " => ", doc.data().key);
      });
    });

    // console.log("newId", newId);
  });

  const createNode = async (node) => {
    // const col = collection(db, "biography");
    // const r = await addDoc(col, { ...node });

    // // Add a new document with a generated id
    // const docRef = doc(collection(db, "biography"));
    // await setDoc(docRef, node);
    // console.log("Document written with ID: ", docRef.id);

    const docRef = doc(db, "biography", String(node.key));
    await setDoc(docRef, node)
      .then(() => {
        console.log("Tạo CON thành công", docRef.id);
      })
      .catch((error) => {
        console.log("setDoc.error", error);
      });
  };

  const createNodeWifeHusband = async (node, getData) => {
    const docRef = doc(db, "biography", String(node.key));
    await setDoc(docRef, node)
      .then(() => {
        console.log("Tạo Vợ/Chồng thành công", docRef.id);
      })
      .catch((error) => {
        console.log("setDoc.error", error);
      });

    // console.log("createNodeWifeHusband.data", data); //Không hiểu sao data state ở đây không có gì
    // console.log("createNodeWifeHusband.getData", getData); //Phải dùng getData truyền thì hàm handleShow
    // console.log("docNewId", docRef.id);
    if (getData.s === "M") {
      // Kiểm tra xem Chồng đã có vợ nào được gán chưa
      if (getData.ux) {
        //Nếu đã có vợ, không update lại thông tin chồng
      } else {
        // Chưa có vợ => Update lại ux
        const currentNode = doc(db, "biography", String(getData.key));
        await updateDoc(currentNode, {
          a: ["B"],
          ux: parseInt(docRef.id),
        })
          .then(() => {
            console.log("Cập nhật ux thành công", getData.key);
          })
          .catch((error) => {
            console.log("updateDoc.error", error);
          });
      }
    } else if (getData.s === "F") {
      // Kiểm tra xem Vợ đã có chồng nào chưa
      if (getData.vir) {
        //Nếu đã có, không update lại thông tin vợ
      } else {
        // Chưa có Chồng => Update lại vir
        const currentNode = doc(db, "biography", String(getData.key));
        await updateDoc(currentNode, {
          a: ["I"],
          vir: parseInt(docRef.id),
        })
          .then(() => {
            console.log("Cập nhật vir thành công", getData.key);
          })
          .catch((error) => {
            console.log("updateDoc.error", error);
          });
      }
    }
  };

  const createNodeParents = async (nodeBo, nodeMe, getData) => {
    // Tạo BỐ
    const docBoId = String(nodeBo.key);
    const docRef1 = doc(db, "biography", docBoId);
    await setDoc(docRef1, nodeBo)
      .then(() => {
        console.log("Tạo Bố thành công", docRef1.id);
      })
      .catch((error) => {
        console.log("setDoc.error", error);
      });

    // Tạo MẸ
    const docMeId = String(nodeMe.key);
    const docRef2 = doc(db, "biography", docMeId);
    await setDoc(docRef2, nodeMe)
      .then(() => {
        console.log("Tạo Mẹ thành công", docRef2.id);
      })
      .catch((error) => {
        console.log("setDoc.error", error);
      });

    //CẬP NHẬT LẠI THÔNG TIN BỐ MẸ CHO NODE HIỆN TẠI
    const docCurId = String(getData.key);
    const currentNode = doc(db, "biography", docCurId);
    await updateDoc(currentNode, {
      f: parseInt(docRef1.id),
      m: parseInt(docRef2.id),
    })
      .then(() => {
        console.log("Cập nhật f,m thành công cho node", getData.key);
      })
      .catch((error) => {
        console.log("updateDoc.error", error);
      });
  };

  const handleClose = () => setShow(false);
  const handleShow = (event) => {
    console.log("newId", newId);
    // console.log("ref.current.data-name", ref.current);

    // console.log("event dataset", event.target.dataset);
    // console.log("data-name", event.target.attributes.getNamedItem("data-name").value);
    var getData = {};
    if (event.target.attributes.getNamedItem("data-key").value) getData.key = parseInt(event.target.attributes.getNamedItem("data-key").value);
    if (event.target.attributes.getNamedItem("data-name").value) getData.n = event.target.attributes.getNamedItem("data-name").value;
    if (event.target.attributes.getNamedItem("data-sex").value) getData.s = event.target.attributes.getNamedItem("data-sex").value;
    if (event.target.attributes.getNamedItem("data-father").value) getData.f = parseInt(event.target.attributes.getNamedItem("data-father").value);
    if (event.target.attributes.getNamedItem("data-mother").value) getData.m = parseInt(event.target.attributes.getNamedItem("data-mother").value);
    if (event.target.attributes.getNamedItem("data-wife").value) getData.ux = parseInt(event.target.attributes.getNamedItem("data-wife").value);
    if (event.target.attributes.getNamedItem("data-husband").value) getData.vir = parseInt(event.target.attributes.getNamedItem("data-husband").value);
    if (event.target.attributes.getNamedItem("data-attributes").value) getData.a = event.target.attributes.getNamedItem("data-attributes").value;
    setData(getData);
    // console.log("handleShow.data", data);//Không hiểu sao lúc được lúc không
    // console.log("handleShow.getData", getData);

    const dataType = event.target.attributes.getNamedItem("data-type").value;
    // console.log("Giá trị button", dataType);

    // var node = [];
    var node = {};
    node.key = newId;
    node.n = "Chưa xác định";
    node.s = "";
    node.f = "";
    node.m = "";
    node.ux = "";
    node.vir = "";
    node.a = []; // Là array
    node.bio = "";
    node.createdAt = new Date();
    // THÊM CON
    // 1. Nếu s=M (là Bố)
    // - Check có vợ chưa (ux có giá trị)? Nếu có, tạo con, nếu không đưa ra thông báo cần thêm chồng
    if (dataType === "1") {
      // THÊM CON TRAI
      node.s = "M"; //sex=Male
      if (getData.s === "M") {
        // Người chọn là BỐ
        node.f = getData.key;
        if (getData.ux) {
          node.m = getData.ux; //lấy giá trị m(Mẹ) là ux(vợ) của Bố
        } else {
          // Đưa ra thông báo cần thêm chồng
          // Case này không cần handle, vì không có chồng/vợ, menu này không hiện
        }
      } else if (getData.s === "F") {
        // Người chọn là MẸ
        node.m = getData.key;
        if (getData.vir) {
          node.f = getData.vir; //lấy giá trị f(Bố) là vir(chồng) của mẹ
        } else {
          // Đưa ra thông báo cần thêm chồng
          // Case này không cần handle, vì không có chồng/vợ, menu này không hiện
        }
      }

      node.n = node.key;
      createNode(node);
    } else if (dataType === "2") {
      //THÊM CON GÁI
      node.s = "F"; //sex = Female
      if (getData.s === "M") {
        // Người chọn là BỐ
        node.f = getData.key;
        if (getData.ux) {
          node.m = getData.ux; //lấy giá trị m(Mẹ) là ux(vợ) của Bố
        }
      } else if (getData.s === "F") {
        // Người chọn là MẸ
        node.m = getData.key;
        if (getData.vir) {
          node.f = getData.vir; //lấy giá trị f(Bố) là vir(chồng) của mẹ
        }
      }

      node.n = node.key;
      createNode(node);
    } else if (dataType === "3") {
      // THÊM VỢ/CHỒNG
      if (getData.s === "M") {
        // Thêm vợ ==> Node đang chọn là Male
        node.s = "F";
        node.a = ["I"]; // Đánh dấu là vợ
        node.vir = getData.key; //key của Chồng
      } else if (getData.s === "F") {
        // Thêm chồng ==> Node đang chọn là Female
        node.s = "M";
        node.a = ["B"]; // Đánh dấu là chồng
        node.ux = getData.key;
      }

      node.n = node.key; //Tạm lưu tên là key cho dễ dev
      createNodeWifeHusband(node, getData);
    } else if (dataType === "4") {
      // THÊM BỐ/MẸ => Thêm đồng thời 2 node
      // node BỐ
      node.s = "M";
      node.a = ["B"];
      node.ux = node.key + 1;

      // Node MẸ
      var node2 = {};
      node2.key = node.key + 1;
      node2.n = "Chưa xác định";
      node2.s = "F";
      // node2.f = "";
      // node2.m = "";
      // node2.ux = "";
      node2.vir = node.key;
      node2.a = ["I"]; // Là array
      // node2.bio = "";
      node2.createdAt = new Date();

      node.n = node.key;
      node2.n = node2.key;
      createNodeParents(node, node2, getData);
    } else if (dataType === "5") {
      // Handle view/edit/delete
      // Handle bằng Modal riêng
      // console.log("data", data);
      setShow(true);
    }
  };

  return (
    <div>
      <ul id="contextMenu" className="menu">
        <li id="add-son" className="menu-item">
          <Button id="btn-add-data1" variant="primary" data-type="1" data-key="key1" className="btn form-control" onClick={handleShow}>
            Thêm Con Trai
          </Button>
        </li>
        <li id="add-daughter" className="menu-item">
          <Button id="btn-add-data2" variant="primary" data-type="2" data-key="key1" className="btn form-control" onClick={handleShow}>
            Thêm Con Gái
          </Button>
        </li>
        <li id="add-wife" className="menu-item">
          <Button id="btn-add-data3" variant="primary" data-type="3" data-key="key1" className="btn form-control" onClick={handleShow}>
            Thêm Vợ/Chồng
          </Button>
        </li>
        <li id="add-parent" className="menu-item">
          <Button id="btn-add-data4" variant="primary" data-type="4" data-key="key1" className="btn form-control" onClick={handleShow}>
            Thêm Cha/Mẹ
          </Button>
        </li>
        <li id="edit-delete" className="menu-item">
          <Button id="btn-add-data5" variant="primary" data-type="5" data-key="key1" className="btn form-control" onClick={handleShow}>
            Xem/Sửa/Xóa
          </Button>
        </li>
      </ul>
      <br />

      {listNodeData?.length > 0 ? <Diagram /> : <div>Loading</div>}

      {/* Call Modal */}
      <ModalAddSon handleClose={handleClose} show={show} data={data} />
    </div>
  );
}

export default GiaPha2;
