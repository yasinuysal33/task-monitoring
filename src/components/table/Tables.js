import { Fragment, useContext, useEffect, useState } from "react";
import Modal from "../ui/Modal";
import "./Table.css";
import { FaSort } from "react-icons/fa";
// import StaffContext from "../store/staffContext";

import { ref, update } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";
import StaffContext from "../store/staffContext";

function Tables(props) {
  const { uid, isManager } = useContext(StaffContext);
  // const { URL } = useContext(StaffContext);

  const [modifiedTable, setModifiedTable] = useState(props.tabledContent);
  const [isOpen, setIsOpen] = useState(false);
  const [updatingItem, setIsUpdatingItem] = useState();
  const [isAscending, setIsAscending] = useState(true);

  useEffect(() => {
    setModifiedTable([...props.tabledContent]);
  }, [props.tabledContent]);

  // console.log(modifiedTable);

  const completeHandler = (item) => {
    // const selectedTask = push(child(ref(database), "duties/" + item.id)).key;
    // console.log(selectedTask);

    const updates = {};
    updates[uid + "/duties/" + item.id + "/status/"] = !JSON.parse(item.status);
    updates[uid + "/duties/" + item.id + "/completedDate/"] = (() => {
      const date = new Date();
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, 0);
      const day = `${date.getDate()}`.padStart(2, 0);
      return year + "-" + month + "-" + day;
    })();
    console.log(updates);

    return update(ref(database), updates).then(() => {
      const completeArray = modifiedTable.filter((e) => e.id !== item.id);
      setModifiedTable(completeArray);
    });

    /*
    fetch(`${URL}duties/${item.id}.json`, {
      method: "PATCH", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: !item.status,
        completedDate: (() => {
          const date = new Date();
          const year = date.getFullYear();
          const month = `${date.getMonth() + 1}`.padStart(2, 0);
          const day = `${date.getDate()}`.padStart(2, 0);
          return year + "-" + month + "-" + day;
        })(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const compelteArray = modifiedTable.filter((e) => e.id !== item.id);
        setModifiedTable(compelteArray);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      */
  };

  const updateDuty = (item) => {
    setIsOpen(true);
    setIsUpdatingItem(item);
  };

  function sortHelper(criterion) {
    const helperArray = modifiedTable.sort((a, b) => {
      const nameA = a[criterion]?.toUpperCase(); // ignore
      const nameB = b[criterion]?.toUpperCase(); // ignore
      if (nameA > nameB) {
        return isAscending ? -1 : 1;
      }
      if (nameA < nameB) {
        return isAscending ? 1 : -1;
      }

      // names must be equal
      return 0;
    });

    setModifiedTable([...helperArray]);

    setIsAscending((prevState) => {
      return !prevState;
    });
  }

  const lastTable = modifiedTable.map((e, i) => (
    <tr key={e.id}>
      <td key={e.responsible + "number"}>{i + 1}</td>
      <td key={e.responsible + "1"}>{e.responsible}</td>
      <td key={e.unit}>{e.unit}</td>
      <td key={e.duty}>{e.duty}</td>
      <td key={e.description}>{e.description}</td>
      <td className="description" key={e?.updates}>
        {e?.updates}
      </td>
      <td key={e.deadline}>{e.deadline}</td>
      <td key={e.givenDate}>{e.givenDate}</td>
      <td key={e.completedDate + e.id} id={e.id}>
        {e.completedDate}
      </td>
      <td key={e.id + e.responsible} id={e.id}>
        <button onClick={() => updateDuty(e)}>Update</button>
      </td>
      <td key={e.id} id={e.id}>
        {isManager && (
          <button onClick={() => completeHandler(e)}>
            {e.status === true ? "Open" : "Close"}
          </button>
        )}
      </td>
    </tr>
  ));

  return (
    <Fragment>
      {isOpen && <Modal setIsOpen={setIsOpen} updatingItem={updatingItem} />}
      <div style={{ padding: "1rem" }}>
        <table>
          <thead>
            <tr>
              <th
                className="sortedHeader"
                style={{ borderRadius: "5px 0 0 0" }}
              >
                <section>#</section>
              </th>
              <th
                className="sortedHeader"
                onClick={() => sortHelper("responsible")}
              >
                <section>
                  RESPONSIBLE
                  <FaSort style={{ paddingTop: "5px" }} />
                </section>
              </th>
              <th className="sortedHeader" onClick={() => sortHelper("unit")}>
                <section>
                  UNIT
                  <FaSort style={{ paddingTop: "5px" }} />
                </section>
              </th>
              <th>TASK</th>
              <th style={{ width: "30%" }}>DESCRIPTION</th>
              <th style={{ width: "30%" }}>UPDATES</th>
              <th
                className="sortedHeader"
                onClick={() => sortHelper("deadline")}
              >
                <section>
                  DEADLINE
                  <FaSort style={{ paddingTop: "5px" }} />
                </section>
              </th>

              <th
                className="sortedHeader"
                onClick={() => sortHelper("givenDate")}
              >
                <section>
                  GIVENDATE
                  <FaSort style={{ paddingTop: "5px" }} />
                </section>
              </th>
              <th
                className="sortedHeader"
                onClick={() => sortHelper("completedDate")}
              >
                <section>
                  COMPL.DATE
                  <FaSort style={{ paddingTop: "5px" }} />
                </section>
              </th>
              <th>ACTION</th>
              <th style={{ borderRadius: "0 5px 0 0" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>{modifiedTable !== "" && lastTable}</tbody>
        </table>
      </div>
    </Fragment>
  );
}

export default Tables;
