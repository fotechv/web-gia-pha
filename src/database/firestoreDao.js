import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

import { createSlice } from "@reduxjs/toolkit";

// // Import the functions you need from the SDKs you need
// import { initializeApp, firebase } from 'firebase/app';
// import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {};

export const listNodeArray = [
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
];

const listNodeArraySlice = createSlice({
  name: "listNodeArray", // tên chuỗi xác định slice
  initialState: 0, // giá trị khởi tạo ban đầu
  reducers: {
    // tạo các actions
    getList(state, action) {
      //action increase
      return listNodeArray;
    },
    decrease(state, action) {
      //action decrease
      return state - 1;
    },
  },
});

const { reducer } = listNodeArraySlice;
export default reducer;

// // Get a list of cities from your database
// async function getCities() {
//     const citiesCol = collection(db, 'cities');
//     const citySnapshot = await getDocs(citiesCol);
//     const cityList = citySnapshot.docs.map((doc) => doc.data());
//     return cityList;
// }

// // export const getUsers = () => {
// //     return new Promise((resolve, reject) => {
// //         firestore.collection('users').onSnapshot((snapshot) => {
// //             console.log('onSnapshot Called!');
// //             let updatedData = snapshot.docs.map((doc) => doc.data());
// //             resolve(updatedData);
// //         }, reject);
// //     });
// // };

// async function getUsers() {
//     const usersCol = collection(db, 'users');
//     const userSnapshot = await getDocs(usersCol);
//     const userList = userSnapshot.docs.map((doc) => doc.data());
//     return userList;
// }

// Add new useraddUser
async function addUser() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815,
    });
    console.log("Document written with ID: ", docRef.id);

    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  return "";
}

// // GET List TOKEN
// async function getListToken() {
//     const cols = collection(db, 'NewPairToken');
//     const snapshot = await getDocs(cols);
//     const list = snapshot.docs.map((doc) => doc.data());
//     return list;
// }

// -----------------

// get list token
