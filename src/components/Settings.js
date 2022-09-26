import { useContext } from "react";
import SettingsForm from "./form/SettingsForm";
import StaffContext from "./store/staffContext";
import { ref, set, remove } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

const Settings = (props) => {
  const { uid } = useContext(StaffContext);

  const sendDepartment = (data) => {
    set(ref(database, uid + "/units/" + btoa(Math.random())), {
      ...data,
    })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => alert(err.code, err.message));

    /*
    fetch(`${URL}units.json`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((returningID) => {
        console.log("Success:", returningID);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });*/
  };

  const updateDepartment = (id, data) => {
    set(ref(database, uid + "/units/" + id), {
      ...data,
    })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => alert(err.code, err.message));
    /*
    fetch(`${URL}units/${id}.json`, {
      method: "PATCH", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((returningID) => {
        console.log("Success:", returningID);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      */
  };

  const deleteDepartment = (id) => {
    remove(ref(database, uid + "/units/" + id))
      .then(() => {
        window.location.reload();
      })
      .catch((err) => alert(err.code, err.message));
    /*
    fetch(`${URL}units/${id}.json`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((returningID) => {
        console.log("Success:", returningID);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      */
  };

  const sendStaff = (id, data) => {
    set(ref(database, uid + "/units/" + id + "/staff/"), {
      ...data,
    })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => alert(err.code, err.message));
    /*
    fetch(`${URL}units/${id}.json`, {
      method: "PATCH", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ staff: data }),
    })
      .then((response) => response.json())
      .then((returningID) => {
        console.log("Success:", returningID);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      */
  };

  const sendFirstAdminEmail = (data) => {
    set(ref(database, uid + "/adminemail/" + btoa(Math.random())), {
      ...data,
    })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => alert(err.code, err.message));

    /*
    fetch(`${URL}adminemail.json`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((returningID) => {
        console.log("Success:", returningID);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      */
  };

  const sendAdminEmail = (data, id) => {
    set(ref(database, uid + "/adminemail/" + id + "/emails"), {
      ...data,
    })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => alert(err.code, err.message));
    /*
    fetch(`${URL}adminemail/${id}.json`, {
      method: "PATCH", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emails: data }),
    })
      .then((response) => response.json())
      .then((returningID) => {
        console.log("Success:", returningID);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      */
  };

  return (
    <SettingsForm
      sendNewDepartment={sendDepartment}
      updateTheDepartment={updateDepartment}
      sendNewStaff={sendStaff}
      sendNewAdminEmail={sendAdminEmail}
      sendTheFirstAdminEmail={sendFirstAdminEmail}
      deleteTheDepartment={deleteDepartment}
    />
  );
};

export default Settings;
