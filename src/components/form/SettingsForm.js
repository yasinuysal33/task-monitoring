import { Fragment, useContext, useRef, useState } from "react";
import classes from "./SettingsForm.module.css";
import StaffContext from "../store/staffContext";
import { getAuth, updatePassword } from "firebase/auth";

function SettingsForm(props) {
  const staffCtx = useContext(StaffContext);

  const [isStaffSectionOpen, setIsStaffSectionOpen] = useState(false);
  const [isUpdateStaffSectionOpen, setIsUpdateStaffSectionOpen] =
    useState(false);
  const [isUpdateDeptSectionOpen, setIsUpdateDeptSectionOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDepartment2, setSelectedDepartment2] = useState("");
  const [selectedDepartment3, setSelectedDepartment3] = useState("");

  const [isUpdateAdminEmailSectionOpen, setIsUpdateAdminEmailSectionOpen] =
    useState(false);

  const departments = staffCtx?.staff.map((e) => e.department);

  const departmentOptions = departments.map((el, i) => (
    <option key={i} value={el}>
      {el}
    </option>
  ));

  const departmentNameAdded = useRef();
  const departmentNameAdded2 = useRef();
  const inChargeAdded = useRef();
  const inChargeAdded2 = useRef();
  const emailAdded = useRef();
  const emailAdded2 = useRef();
  //   const staffDefault = useRef();
  const enteredDepartment = useRef();
  const enteredDepartment2 = useRef();
  const enteredDepartment3 = useRef();
  const enteredStaff = useRef();
  const updateStaffForm = useRef();
  const updatedAdminEmailForm = useRef();

  const enteredAdminEmail = useRef();

  const passwordInputRef = useRef();

  function findDepartment(e) {
    e.preventDefault();

    setIsStaffSectionOpen(true);

    const tempDept = staffCtx?.staff?.filter(
      (el) => el.department === enteredDepartment.current.value
    );
    setSelectedDepartment(...tempDept);
  }

  function findDepartment2(e) {
    e.preventDefault();

    setIsUpdateDeptSectionOpen(true);

    const tempDept = staffCtx?.staff?.filter(
      (el) => el.department === enteredDepartment2.current.value
    );
    console.log(...tempDept);
    setSelectedDepartment2(...tempDept);
  }

  function findDepartment3(e) {
    e.preventDefault();

    setIsUpdateStaffSectionOpen(true);

    const tempDept = staffCtx?.staff?.filter(
      (el) => el.department === enteredDepartment3.current.value
    );
    setSelectedDepartment3(...tempDept);
  }

  function addStaff(e) {
    e.preventDefault();

    const staffArray = [...selectedDepartment.staff];

    staffArray.push(
      enteredStaff.current.value
        .toLowerCase()
        .split(" ")
        .map((el) => el[0].toUpperCase() + el.slice(1))
        .join(" ")
    );

    props.sendNewStaff(selectedDepartment.id, staffArray);
  }

  function updateStaff(e) {
    e.preventDefault();

    const tempStaff = [];

    for (const elem of updateStaffForm.current.elements) {
      if (elem.type === "text" && elem.value !== "") {
        tempStaff.push(elem.value);
      }
    }

    console.log(tempStaff);

    props.sendNewStaff(selectedDepartment3.id, tempStaff);
  }

  function departmentSubmitHandler(e) {
    e.preventDefault();

    const departmentAdded = {
      department: departmentNameAdded.current.value.toUpperCase(),
      incharge: inChargeAdded.current.value
        .toLowerCase()
        .split(" ")
        .map((el) => el[0].toUpperCase() + el.slice(1))
        .join(" "),
      email: emailAdded.current.value,
      staff: [
        departmentNameAdded.current.value.toUpperCase(),
        inChargeAdded.current.value
          .toLowerCase()
          .split(" ")
          .map((el) => el[0].toUpperCase() + el.slice(1))
          .join(" "),
      ],
    };

    props.sendNewDepartment(departmentAdded);

    e.target.reset();
  }

  function departmentUpdateHandler(e) {
    e.preventDefault();

    const departmentAdded = {
      department: departmentNameAdded2.current.value.toUpperCase(),
      incharge: inChargeAdded2.current.value
        .toLowerCase()
        .split(" ")
        .map((el) => el[0].toUpperCase() + el.slice(1))
        .join(" "),
      email: emailAdded2.current.value,
      staff: selectedDepartment2.staff,
    };

    // console.log(selectedDepartment2.id, departmentAdded);

    props.updateTheDepartment(selectedDepartment2.id, departmentAdded);

    e.target.reset();
  }

  function deleteDepartment(e) {
    e.preventDefault();

    props.deleteTheDepartment(selectedDepartment2.id);

    e.target.reset();
  }

  function fetchAdminEmail(e) {
    e.preventDefault();
    setIsUpdateAdminEmailSectionOpen(true);
  }

  function addAdminEmail(e) {
    e.preventDefault();

    if (staffCtx.adminEmail.length === 0) {
      props.sendTheFirstAdminEmail({
        emails: [enteredAdminEmail.current.value],
      });
    } else {
      const tempEmailArry = [...staffCtx.adminEmail[0].emails];

      tempEmailArry.push(enteredAdminEmail.current.value);

      props.sendNewAdminEmail(tempEmailArry, staffCtx.adminEmail[0].id);
    }

    e.target.reset();
  }

  function updateAdminEmail(e) {
    e.preventDefault();

    const tempAdminEmails = [];

    for (const elem of updatedAdminEmailForm.current.elements) {
      if (elem.type === "email" && elem.value !== "") {
        tempAdminEmails.push(elem.value);
      }
    }

    props.sendNewAdminEmail(tempAdminEmails, staffCtx.adminEmail[0].id);
  }

  function changePassword(e) {
    e.preventDefault();
    const auth = getAuth();

    updatePassword(auth.currentUser, passwordInputRef.current.value)
      .then((response) => {
        alert("Password Changed");
        e.target.reset();
      })
      .catch((err) => {
        alert(err.code, err.message);
      });

    /*
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCbdcWaqYEnCSOAshTAofyzXp0ClB-YsAY",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: staffCtx.token,
          password: passwordInputRef.current.value,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication failed!";
            errorMessage = data?.error?.message;
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data);
        e.target.reset();
      })
      .catch((err) => {
        alert(err.message);
      });*/
  }

  return (
    <div className={classes.card}>
      <form className={classes.form} onSubmit={departmentSubmitHandler}>
        <fieldset className={classes.legend}>
          <legend>Add Department:</legend>
          <div className={classes.control}>
            <section>
              <label htmlFor="DEPARTMENT">DEPARTMENT</label>
              <input
                type="text"
                id="DEPARTMENT"
                ref={departmentNameAdded}
                required
              />
            </section>
            <section>
              <label htmlFor="IN CHARGE">IN CHARGE</label>
              <input type="text" id="IN CHARGE" ref={inChargeAdded} required />
            </section>
            <section>
              <label htmlFor="EMAIL1">EMAIL</label>
              <input type="email" id="EMAIL1" ref={emailAdded} required />
            </section>

            <section>
              <button type="submit">Add</button>
            </section>
          </div>
        </fieldset>
      </form>

      <form className={classes.form}>
        <fieldset className={classes.legend}>
          <legend>Add Staff:</legend>
          <div className={classes.control}>
            <section>
              <select
                className={classes.unit}
                id="unit1"
                name="units"
                ref={enteredDepartment}
              >
                {departmentOptions}
              </select>
              <button onClick={findDepartment}>Select</button>
            </section>

            {isStaffSectionOpen && (
              <section>
                <label htmlFor="NEW STAFF">NEW STAFF</label>
                <input type="text" id="NEW STAFF" ref={enteredStaff} required />
                <button onClick={addStaff}>Add</button>
              </section>
            )}
          </div>
        </fieldset>
      </form>

      <form onSubmit={departmentUpdateHandler} className={classes.form}>
        <fieldset className={classes.legend}>
          <legend>Update Department:</legend>
          <div className={classes.control}>
            <section>
              <select
                className={classes.unit}
                id="unit2"
                name="units"
                ref={enteredDepartment2}
              >
                {departmentOptions}
              </select>
              <button onClick={findDepartment2}>Select</button>
            </section>

            {isUpdateDeptSectionOpen && (
              <Fragment>
                <section>
                  <label htmlFor="DEPARTMENT">DEPARTMENT</label>
                  <input
                    type="text"
                    id="DEPARTMENT"
                    key={selectedDepartment2.department}
                    defaultValue={selectedDepartment2.department}
                    ref={departmentNameAdded2}
                    required
                  />
                </section>
                <section>
                  <label htmlFor="IN CHARGE">IN CHARGE</label>
                  <input
                    type="text"
                    id="IN CHARGE"
                    key={selectedDepartment2.incharge}
                    defaultValue={selectedDepartment2.incharge}
                    ref={inChargeAdded2}
                    required
                  />
                </section>
                <section>
                  <label htmlFor="EMAIL">EMAIL</label>
                  <input
                    type="email"
                    id="EMAIL"
                    key={selectedDepartment2.email}
                    defaultValue={selectedDepartment2.email}
                    ref={emailAdded2}
                    required
                  />
                </section>

                <section>
                  <button type="submit">Update</button>
                  <button onClick={deleteDepartment}>Delete</button>
                </section>
              </Fragment>
            )}
          </div>
        </fieldset>
      </form>

      <form
        ref={updateStaffForm}
        onSubmit={updateStaff}
        className={classes.form}
      >
        <fieldset className={classes.legend}>
          <legend>Update Staff:</legend>
          <div className={classes.control}>
            <section>
              <select
                className={classes.unit}
                id="unit3"
                name="units"
                ref={enteredDepartment3}
              >
                {departmentOptions}
              </select>
              <button onClick={findDepartment3}>Select</button>
            </section>

            {isUpdateStaffSectionOpen && (
              <Fragment>
                {selectedDepartment3.staff.map((person, i) => (
                  <section key={i}>
                    <label style={{ display: "block" }} htmlFor="CURRENT STAFF">
                      STAFF {i + 1}
                    </label>
                    <input
                      type="text"
                      key={person}
                      defaultValue={person}
                      id={i}
                    />
                  </section>
                ))}

                <section>
                  <button type="submit">Update</button>
                </section>
              </Fragment>
            )}
          </div>
        </fieldset>
      </form>

      <form className={classes.form} onSubmit={addAdminEmail}>
        <fieldset className={classes.legend}>
          <legend>Add Admin Email:</legend>
          <div className={classes.control}>
            <section>
              <label htmlFor="EMAIL2">EMAIL</label>
              <input
                type="email"
                id="EMAIL2"
                ref={enteredAdminEmail}
                required
              />
              <button type="submit">Add</button>
            </section>
          </div>
        </fieldset>
      </form>

      <form
        ref={updatedAdminEmailForm}
        className={classes.form}
        onSubmit={updateAdminEmail}
      >
        <fieldset className={classes.legend}>
          <legend>Update Admin Email:</legend>
          <div className={classes.control}>
            <section>
              <button onClick={fetchAdminEmail}>Fetch</button>
            </section>

            {isUpdateAdminEmailSectionOpen && (
              <Fragment>
                {staffCtx?.adminEmail[0]?.emails.map((email, i) => (
                  <section key={i}>
                    <label style={{ display: "block" }} htmlFor={email}>
                      EMAIL {i + 1}
                    </label>
                    <input
                      type="email"
                      key={email}
                      defaultValue={email}
                      id={i}
                    />
                  </section>
                ))}

                <section>
                  <button type="submit">Update</button>
                </section>
              </Fragment>
            )}
          </div>
        </fieldset>
      </form>
      <form className={classes.form} onSubmit={changePassword}>
        <fieldset className={classes.legend}>
          <legend>Change Password:</legend>
          <div className={classes.control}>
            <section>
              <label htmlFor="PASSWORD">PASSWORD</label>
              <input
                type="password"
                id="PASSWORD"
                ref={passwordInputRef}
                minLength="6"
                required
              />
              <button>Change</button>
            </section>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default SettingsForm;
