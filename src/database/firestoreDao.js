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
