import React, { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MenuBootstrap from "./MenuBootstrap";
import GiaPhaDemo from "./GiaPhaDemo";
import GiaPha1 from "./GiaPha1";
import GiaPha2 from "./GiaPha2";
import ContextMenus from "./ContextMenus";
import { MyComponent, CustomTextInput, AutoFocusTextInput, Parent } from "./ReactJsDemo";
import ModalDemo from "./components/ModalDemo";

function App() {
  return (
    <Fragment>
      <MenuBootstrap />
      <BrowserRouter>
        <Routes>
          <Route index element={<GiaPha1 />} />
          <Route path="demo" element={<GiaPha1 />} />
          <Route path="gia-pha1" element={<GiaPha1 />} />
          <Route path="gia-pha2" element={<GiaPha2 />} />
          <Route path="context-menu" element={<ContextMenus />} />
          <Route path="reactjs-demo" element={<CustomTextInput />} />
          <Route path="modal-demo" element={<ModalDemo />} />
          <Route path="quan-ly" element={<ModalDemo />} />
          <Route path="/" element={<GiaPha1 />}></Route>
        </Routes>
      </BrowserRouter>

      {/* Để chạy code của GiaPhaDemo thì lưu ý mở comment trong file public/index.html*/}
      {/* Và phải comment lại thẻ <BrowserRouter>...<BrowserRouter/> */}
      {/* Nếu gặp lỗi conflict thì comment lại các nơi import libs "gojs" */}
      {/* <GiaPhaDemo /> */}
    </Fragment>
  );
}

export default App;
