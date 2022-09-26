// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbdcWaqYEnCSOAshTAofyzXp0ClB-YsAY",
  authDomain: "tasks-87a69.firebaseapp.com",
  databaseURL: "https://tasks-87a69-default-rtdb.firebaseio.com",
  projectId: "tasks-87a69",
  storageBucket: "tasks-87a69.appspot.com",
  messagingSenderId: "785713493895",
  appId: "1:785713493895:web:4839eef350d9d62ad10522",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
