import classes from "./Modal.module.css";
import { RiCloseLine } from "react-icons/ri";
import { Fragment, useContext } from "react";
import UpdatedDutyForm from "../form/UpdatedDutyForm";
// import StaffContext from "../store/staffContext";

import { ref, set, remove } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";
import StaffContext from "../store/staffContext";

const Modal = ({ setIsOpen, updatingItem }) => {
  const { uid } = useContext(StaffContext);
  // const { URL } = useContext(StaffContext);

  function getDutyDataHandler(data) {
    set(ref(database, uid + "/duties/" + updatingItem.id), {
      ...data,
    })
      .then(() => {
        console.log("Data updated");
      })
      .catch((err) => alert(err.code, err.message));
    window.location.reload();
    setIsOpen(false);
    /*  fetch(`${URL}duties/${updatingItem.id}.json`, {
      method: "PATCH", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
        window.location.reload();
        setIsOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });*/
  }

  function deleteHandler() {
    console.log(updatingItem.id);

    remove(ref(database, uid + "/duties/" + updatingItem.id))
      .then(() => {
        console.log("Data deleted");
      })
      .catch((err) => alert(err.code, err.message));
    window.location.reload();
    setIsOpen(false);
    /*
    fetch(`${URL}duties/${updatingItem.id}.json`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((returningID) => {
        console.log("Success:", returningID);
        window.location.reload();
        setIsOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      */
  }

  return (
    <Fragment>
      <div className={classes.darkBG} onClick={() => setIsOpen(false)} />

      <div className={classes.modal}>
        <button className={classes.closeBtn} onClick={() => setIsOpen(false)}>
          <RiCloseLine style={{ marginBottom: "-3px" }} />
        </button>
        <UpdatedDutyForm
          getDutyData={getDutyDataHandler}
          deleteDuty={deleteHandler}
          updatingItem={updatingItem}
        />
      </div>
    </Fragment>
  );
};

export default Modal;
