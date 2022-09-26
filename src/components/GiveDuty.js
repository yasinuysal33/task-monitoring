import { useContext } from "react";
import NewDutyForm from "./form/NewDutyForm";
import StaffContext from "./store/staffContext";

import { ref, set } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

function GiveDuty() {
  const { uid } = useContext(StaffContext);

  function getDutyDataHandler(data) {
    set(ref(database, uid + "/duties/" + btoa(Math.random())), {
      ...data,
    })
      .then(() => {
        console.log("Task given");
      })
      .catch((err) => alert(err.code, err.message));

    /*
    fetch(`${URL}duties.json`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((returningID) => {
        console.log("Success:", returningID);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      */
  }
  return <NewDutyForm getDutyData={getDutyDataHandler} />;
}

export default GiveDuty;
