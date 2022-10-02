// Import the functions you need from the SDKs you need
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

async function fetchFirebaseData() {
  const response = await axios.put("http://localhost:5000/fetchfirebasedata");
  return response.data;
}

const firebaseConfig = await fetchFirebaseData();

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
