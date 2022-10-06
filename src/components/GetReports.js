import { Fragment, useState, useRef, useContext } from "react";

import classes from "./GetReports.module.css";
import StaffContext from "./store/staffContext";
import Tables from "./table/Tables";
import LoadingSpinner from "./ui/LoadingSpinner";

import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

function GetReports() {
  const [isLoading, setIsLoading] = useState(null);
  const [filteredArray, setFilteredArray] = useState([]);

  const enteredUnit = useRef();
  const enteredResponsible = useRef();
  const enteredDeadline = useRef();
  const enteredGivenDate = useRef();
  const enteredStatus = useRef();
  const formElement = useRef();

  const { staff, uid, deptName, isManager } = useContext(StaffContext);

  const upperGroup = staff.map((el) => (
    <option key={el.id} value={el.department}>
      {el.department}
    </option>
  ));

  const listedStaff = isManager
    ? staff.map((el) =>
        el.staff.map((person) => (
          <option key={person} value={person}>
            {person}
          </option>
        ))
      )
    : staff
        .filter((el) => el.department === deptName)
        .map((el) =>
          el.staff.map((person) => (
            <option key={person} value={person}>
              {person}
            </option>
          ))
        );

  function submitHandler(e) {
    setIsLoading(true);
    e.preventDefault();

    const responsible = enteredResponsible.current.value;
    const unit = enteredUnit.current.value;
    const deadline = enteredDeadline.current.value;
    const givenDate = enteredGivenDate.current.value;
    const status = enteredStatus.current.value;

    const mainData = ref(database, uid + "/duties/");
    onValue(mainData, (snapshot) => {
      const data = snapshot.val();
      // updateStarCount(postElement, data);

      const dataArray = [];

      for (const key in data) {
        const item = { id: key, ...data[key] };
        dataArray.push(item);
      }

      const arr = dataArray.filter((e) => {
        return (
          (responsible === "" ? true : e.responsible === responsible) &&
          (unit === "" ? true : e.unit === unit) &&
          (deadline === "" ? true : e.deadline === deadline) &&
          (givenDate === "" ? true : e.givenDate === givenDate) &&
          (status === String(e.status) ? true : false)
        );
      });

      setFilteredArray(arr);
      setIsLoading(false);
    });
    /*
    const fetchData = async () => {
      fetch(`${URL}duties.json`)
        .then((response) => response.json())
        .then((data) => {
          const dataArray = [];

          for (const key in data) {
            const item = { id: key, ...data[key] };
            dataArray.push(item);
          }

          const arr = dataArray.filter((e) => {
            return (
              (responsible === "" ? true : e.responsible === responsible) &&
              (unit === "" ? true : e.unit === unit) &&
              (deadline === "" ? true : e.deadline === deadline) &&
              (givenDate === "" ? true : e.givenDate === givenDate) &&
              (status === String(e.status) ? true : false)
            );
          });

          setFilteredArray(arr);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
        
    };

    fetchData();
    */
  }

  return (
    <Fragment>
      <div className={classes.card}>
        <form
          className={classes.form}
          onSubmit={submitHandler}
          ref={formElement}
        >
          <fieldset className={classes.legend}>
            <legend>Task Filters:</legend>
            <div className={classes.control}>
              <label htmlFor="unit">UNIT</label>
              <select
                className={classes.select}
                id="unit"
                name="units"
                ref={enteredUnit}
              >
                <option value={!isManager ? deptName : ""}>
                  {!isManager ? deptName : ""}
                </option>
                {!isManager ? "" : upperGroup}
              </select>
            </div>
            <div className={classes.control}>
              <label htmlFor="responsible">RESPONSIBLE</label>
              <select
                className={classes.select}
                id="responsible"
                name="responsibles"
                ref={enteredResponsible}
              >
                <option value=""></option>
                {listedStaff}
              </select>
            </div>

            <div className={classes.control}>
              <label htmlFor="deadline">DEADLINE</label>
              <input type="date" id="deadline" ref={enteredDeadline} />
            </div>
            <div className={classes.control}>
              <label htmlFor="givenDate">TASK GIVEN DATE</label>
              <input type="date" id="givenDate" ref={enteredGivenDate} />
            </div>
            <div className={classes.control}>
              <label htmlFor="status">STATUS</label>
              <select
                className={classes.select}
                id="status"
                name="status"
                ref={enteredStatus}
              >
                <option value={false}>Open</option>
                <option value={true}>Close</option>
              </select>
            </div>
            <div className={classes.actions}>
              <button>Filter</button>
            </div>
          </fieldset>
        </form>
        {isLoading && <LoadingSpinner />}
        {isLoading !== null && !isLoading && (
          <Tables tabledContent={filteredArray} />
        )}
      </div>
    </Fragment>
  );
}

export default GetReports;
