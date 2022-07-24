import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { collection, query, onSnapshot, getDocs, addDoc, updateDoc, deleteDoc, doc, getFirestore } from "firebase/firestore";
import { db } from "../database/firebaseConfig";
import { async } from "@firebase/util";

const ModalAddSon = ({ handleClose, show, data }) => {
  const [newId, setNewId] = useState();

  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const createSon = async (son) => {
    console.log("addSon", son);

    console.log("newId", newId);
    const item = [];
    item["id"] = newId;
    item["key"] = newId;
    item["n"] = getValues("n");
    item["s"] = getValues("s");
    item["f"] = getValues("f");
    item["m"] = getValues("m");
    item["ux"] = newId;
    item["vir"] = newId;
    item["a"] = [];
    console.log("item", item);
    // await addDoc(usersCollection, { ...son });
  };

  useEffect(() => {
    const col = collection(db, "biography");
    const q = query(col);
    onSnapshot(q, (querySnapshot) => {
      setNewId(querySnapshot.size);
    });
  });

  return (
    <Modal show={show} onHide={handleClose}>
      {/* <form onSubmit={handleSubmit(createSon)}> */}
      <Form onSubmit={handleSubmit(createSon)}>
        <Modal.Header closeButton>
          <Modal.Title>THÔNG TIN CÁ NHÂN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" id="exampleForm.ControlInput1">
            <Form.Label>Tên của node: </Form.Label>
            <Form.Label>
              {data["n"]} <span>({data["s"] === "M" ? "Nam" : "Nữ"})</span>
            </Form.Label>
          </Form.Group>
          <Form.Group className="mb-3" id="exampleForm.ControlInput1">
            <Form.Label>Giới tính: </Form.Label>
            <Form.Label>{data["s"] === "M" ? "Nam" : "Nữ"}</Form.Label>
          </Form.Group>
          <Form.Group className="mb-3" id="exampleForm.ControlInput1">
            <Form.Label>key: </Form.Label>
            <Form.Label>{data["key"]}</Form.Label>
          </Form.Group>
          <Form.Group className="mb-3" id="exampleForm.ControlInput1">
            <Form.Label>{data["s"] === "M" ? `key của vợ là: ${data["ux"]}` : `key của chồng là: ${data["vir"]}`} </Form.Label>
            <Form.Label>{data["m"]}</Form.Label>
          </Form.Group>

          <FloatingLabel id="fullName" label="Họ và tên" className="mb-3">
            <Form.Control as="textarea" id="fullName" {...register("n", { required: true })}></Form.Control>
            <Form.Text className="text-muted">{errors.n?.type === "required" && "Bắt buộc nhập họ và tên"}</Form.Text>
          </FloatingLabel>
          <Row>
            <Form.Label column lg={5}>
              Key của bản thân
            </Form.Label>
            <Col>
              <Form.Control type="number" id="key" {...register("key", { required: true })} placeholder="Nhập key của bản thân" />
              <Form.Text className="text-muted">{errors.key?.type === "required" && "Bắt buộc nhập Key của bản thân"}</Form.Text>
            </Col>
          </Row>
          <br />
          <Row>
            <Form.Label column lg={5}>
              Key của bố
            </Form.Label>
            <Col>
              <Form.Control type="number" id="keyFather" {...register("f", { required: true })} />
              <Form.Text className="text-muted">{errors.key?.type === "required" && "Bắt buộc nhập Key của bố"}</Form.Text>
            </Col>
          </Row>
          <br />
          <Row>
            <Form.Label column lg={5}>
              Key của mẹ
            </Form.Label>
            <Col>
              <Form.Control type="number" id="keyMother" {...register("m", { required: true })} />
              <Form.Text className="text-muted">{errors.key?.type === "required" && "Bắt buộc nhập Key của mẹ"}</Form.Text>
            </Col>
          </Row>
          <br />
          <Row>
            <Form.Label column lg={5}>
              Giới tính
            </Form.Label>
            <Col>
              <Form.Control type="number" id="sex" {...register("s", { required: true })} />
              <Form.Text className="text-muted">{errors.key?.type === "required" && "Bắt buộc nhập giới tính"}</Form.Text>
            </Col>
          </Row>

          {/* <div>
              <label for="fullName">Họ và tên:</label>
              <br></br>
              <input type="text" {...register("n", { required: true })} id="fullName" />
              {errors.n?.type === "required" && "Bắt buộc nhập họ và tên"}
            </div> */}
          {/* <div>
              <label for="key">Key của bản thân:</label>
              <br></br>
              <input type="number" {...register("key", { required: true })} id="key" />
              {errors.key?.type === "required" && "Bắt buộc nhập Key của bản thân"}
            </div> */}
          {/* <div>
              <label for="keyFather">Key của bố:</label>
              <br></br>
              <input type="number" {...register("f", { required: true })} id="keyFather" />
              {errors.f?.type === "required" && "Bắt buộc nhập Key của bố"}
            </div> */}
          {/* <div>
              <label for="keyMother">Key của mẹ:</label>
              <br></br>
              <input type="number" {...register("m", { required: true })} id="keyMother" />
              {errors.m?.type === "required" && "Bắt buộc nhập Key của mẹ"}
            </div> */}
          {/* <div>
              <label for="sex">Gới tính:</label>
              <br></br>
              <input type="text" {...register("s", { required: true })} id="sex" />
              {errors.s?.type === "required" && "Bắt buộc nhập giới tính"}
            </div> */}

          {/* <input {...register("key", { required: true })} />
            {errors.lastName && <p>Last name is required</p>} */}

          {/* <input type="submit" /> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={() => {
              handleClose();
              createSon();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
      {/* </form> */}
    </Modal>
  );
};

export default ModalAddSon;
