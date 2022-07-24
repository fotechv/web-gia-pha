import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { collection, query, onSnapshot, getDocs, addDoc, getDoc, setDoc, updateDoc, deleteDoc, doc, getFirestore } from "firebase/firestore";
import { db } from "../database/firebaseConfig";
import { async } from "@firebase/util";

const ModalAddSon = ({ handleClose, show, data }) => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const updateDocNode = async (dataForm) => {
    console.log("dataForm", dataForm);
    // const item = {};
    // item.key = newId;
    // item.n = getValues("n");
    // item.s = getValues("s");
    // item.f = getValues("f");
    // item.m = getValues("m");
    // item.ux = newId;
    // item.vir = newId;
    // item.a = [];
    // item.bio = [];
    // console.log("item", item);

    // await addDoc(usersCollection, { ...son });
    // Update thông tin node
    if (getValues("n")) {
      const currentNode = doc(db, "biography", String(data.key));
      await updateDoc(currentNode, {
        n: getValues("n"),
      })
        .then(() => {
          console.log("Cập nhật thông tin thành công", data.key);
        })
        .catch((error) => {
          console.log("updateDoc.error", error);
        });
    } else {
      // Đưa ra thông báo ở đây
    }
  };

  const deleteNode = async () => {
    const docCurId = String(data.key);
    const dataBak = await getDoc(doc(db, "biography", docCurId));
    console.log("dataBak", dataBak);
    if (dataBak.exists()) {
      console.log("Document data:", dataBak.data());
      // Backup trước khi xóa
      const docBak = doc(db, "biography_backup", docCurId);
      await setDoc(docBak, dataBak.data())
        .then(() => {
          console.log("Backup thành công", docBak.id);
        })
        .catch((error) => {
          console.log("setDoc.error", error);
        });

      // XÓA node
      await deleteDoc(doc(db, "biography", docCurId))
        .then(() => {
          console.log("Xóa node thành công", docCurId);
        })
        .catch((error) => {
          console.log("deleteDoc.error", error);
        });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      {/* <form onSubmit={handleSubmit(createSon)}> */}
      <Form onSubmit={handleSubmit(updateDocNode)}>
        {/* <Form onSubmit={handleSubmit(deleteNode)}> */}
        <Modal.Header closeButton>
          <Modal.Title>THÔNG TIN CÁ NHÂN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" id="key-form">
            <Form.Label>Mã cá nhân:&nbsp;</Form.Label>
            <Form.Label>{data["key"]}</Form.Label>
          </Form.Group>
          <FloatingLabel id="fullName" label="Họ và tên" className="mb-3">
            <Form.Control as="textarea" id="fullName" {...register("n", { required: true })} defaultValue={data["n"]} />
            <Form.Text className="text-muted">{errors.n?.type === "required" && "Bắt buộc nhập họ và tên"}</Form.Text>
          </FloatingLabel>
          <Form.Group className="mb-3" id="bio-form">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control as="textarea" id="bio" rows={6} {...register("bio")} />
          </Form.Group>
          {/* <Form.Group className="mb-3" id="exampleForm.ControlInput1">
            <Form.Label>{data["s"] === "M" ? `key của vợ là: ${data["ux"]}` : `key của chồng là: ${data["vir"]}`} </Form.Label>
            <Form.Label>{data["m"]}</Form.Label>
          </Form.Group> */}
          {/* <Row>
            <Form.Label column lg={5}>
              Key của bản thân
            </Form.Label>
            <Col>
              <Form.Control type="number" id="key" {...register("key", { required: true })} placeholder="Nhập key của bản thân" />
              <Form.Text className="text-muted">{errors.key?.type === "required" && "Bắt buộc nhập Key của bản thân"}</Form.Text>
            </Col>
          </Row> */}
          {/* <Row>
            <Form.Label column lg={5}>
              Key của bố
            </Form.Label>
            <Col>
              <Form.Control type="number" id="keyFather" {...register("f", { required: true })} />
              <Form.Text className="text-muted">{errors.key?.type === "required" && "Bắt buộc nhập Key của bố"}</Form.Text>
            </Col>
          </Row> */}
          {/* <Row>
            <Form.Label column lg={5}>
              Key của mẹ
            </Form.Label>
            <Col>
              <Form.Control type="number" id="keyMother" {...register("m", { required: true })} />
              <Form.Text className="text-muted">{errors.key?.type === "required" && "Bắt buộc nhập Key của mẹ"}</Form.Text>
            </Col>
          </Row>
          <br /> */}
          {/* <Row>
            <Form.Label column lg={5}>
              Giới tính
            </Form.Label>
            <Col>
              <Form.Control type="number" id="sex" {...register("s", { required: true })} />
              <Form.Text className="text-muted">{errors.key?.type === "required" && "Bắt buộc nhập giới tính"}</Form.Text>
            </Col>
          </Row> */}
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
              updateDocNode();
            }}
          >
            Save Changes
          </Button>
          <Button
            className="btn btn-danger"
            type="submit"
            variant="primary"
            onClick={() => {
              handleClose();
              deleteNode();
            }}
          >
            Xóa người này
          </Button>
        </Modal.Footer>
      </Form>
      {/* </form> */}
    </Modal>
  );
};

export default ModalAddSon;
