import { useContext, useRef, useState } from "react";
import emailSend from "../email/emailSend";
import StaffContext from "../store/staffContext";
import classes from "./UpdatedDutyForm.module.css";
import Microphone from "../ui/Microphone";

function UpdatedDutyForm(props) {
  const enteredUnit = useRef();
  const enteredDuty = useRef();
  const enteredDescription = useRef();
  const enteredDeadline = useRef();
  const dutyUpdatedDate = useRef();
  const dutyStatus = useRef();
  const checkRef = useRef();

  const staffCtx = useContext(StaffContext);

  const [text, setText] = useState("");
  const [resetText, setResetText] = useState(false);
  const [checked, setChecked] = useState(true);

  const transcriptText = (textTemp) => {
    setText(
      staffCtx.isManager
        ? props.updatingItem.description
        : props.updatingItem?.updates + " " + textTemp
    );
  };

  const staff = staffCtx.staff.map((el) => (
    <optgroup
      key={el.id}
      id={el.department}
      label={el.department}
      data-email={el.email}
    >
      {el.staff.map((person) => (
        <option key={person} value={person}>
          {person}
        </option>
      ))}
    </optgroup>
  ));

  let selectedIndex;

  const checkHandler = () => {
    setChecked((prev) => !prev);
  };

  function deleteHandler(e) {
    e.preventDefault();

    props.deleteDuty();

    // e.target.reset();
  }

  function closeRequest(e) {
    e.preventDefault();

    selectedIndex = enteredUnit.current.selectedIndex;
    const selectedResponsible = enteredUnit.current[selectedIndex].value;
    const selectedOptgroup =
      enteredUnit.current[selectedIndex].parentElement.label;
    const emailName = staffCtx.adminEmail[0].emails;

    const dutyData = {
      title: "Close Request",
      id: props.updatingItem.id,
      responsible: selectedResponsible,
      unit: selectedOptgroup,
      duty: enteredDuty.current.value,
      description: staffCtx.isManager
        ? enteredDescription.current.value
        : props.updatingItem.description,
      updates: !staffCtx.isManager
        ? enteredDescription.current.value
        : props.updatingItem?.updates,
      deadline: enteredDeadline.current.value,
      givenDate: props.updatingItem.givenDate,
      updatedDate: dutyUpdatedDate.current.value,
      status: dutyStatus.current.value,
      email: emailName,
    };

    checked && emailSend(dutyData);

    props.closeModal();

    e.target.reset();
  }

  function submitHandler(e) {
    e.preventDefault();

    selectedIndex = enteredUnit.current.selectedIndex;
    const selectedResponsible = enteredUnit.current[selectedIndex].value;
    const selectedOptgroup =
      enteredUnit.current[selectedIndex].parentElement.label;
    const emailName =
      enteredUnit.current[selectedIndex].parentElement.dataset.email;
    console.log(emailName);

    const dutyData = {
      title: "Task Update",
      id: props.updatingItem.id,
      responsible: selectedResponsible,
      unit: selectedOptgroup,
      duty: enteredDuty.current.value,
      description: staffCtx.isManager
        ? enteredDescription.current.value
        : props.updatingItem.description,
      updates: !staffCtx.isManager
        ? enteredDescription.current.value
        : props.updatingItem?.updates,
      deadline: enteredDeadline.current.value,
      givenDate: props.updatingItem.givenDate,
      updatedDate: dutyUpdatedDate.current.value,
      status: dutyStatus.current.value,
      email: emailName,
    };

    checked && emailSend(dutyData);

    props.getDutyData(dutyData);

    setResetText((prev) => !prev);

    e.target.reset();
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <fieldset className={classes.legend}>
          <legend>Task Details:</legend>
          <div className={classes.control}>
            <label htmlFor="unit">RESPONSIBLE</label>
            <select
              className={classes.unit}
              id="unit"
              name="units"
              ref={enteredUnit}
            >
              <optgroup
                id={props.updatingItem.unit}
                label={props.updatingItem.unit}
                data-email={props.updatingItem.email}
              >
                <option value={props.updatingItem.responsible}>
                  {props.updatingItem.responsible}
                </option>
              </optgroup>
              {staff}
            </select>
          </div>
          <div className={classes.control}>
            <label htmlFor="duty">TASK</label>
            <input
              defaultValue={props.updatingItem.duty}
              type="text"
              id="duty"
              ref={enteredDuty}
              required
            />
          </div>
          <div className={`${classes.control} ${classes.container}`}>
            <label htmlFor="description">DESCRIPTION</label>
            <textarea
              defaultValue={text}
              id="description"
              rows="5"
              ref={enteredDescription}
            ></textarea>
            <Microphone
              transcriptText={transcriptText}
              container={classes.container}
              resetText={resetText}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="deadline">DEADLINE</label>
            <input
              defaultValue={props.updatingItem.deadline}
              type="date"
              id="deadline"
              ref={enteredDeadline}
              required
            />
          </div>
          <div className={classes.control}>
            <input
              type="hidden"
              id="updatedDate"
              ref={dutyUpdatedDate}
              value={(() => {
                const date = new Date();
                const year = date.getFullYear();
                const month = `${date.getMonth() + 1}`.padStart(2, 0);
                const day = date.getDate();
                return year + "-" + month + "-" + day;
              })()}
            />
          </div>
          <div className={classes.control}>
            <input
              type="hidden"
              id="status"
              ref={dutyStatus}
              value={props.updatingItem.status}
            />
          </div>
          <div className={classes.actions}>
            <button onClick={staffCtx.isManager ? deleteHandler : closeRequest}>
              {staffCtx.isManager ? "Delete Task" : "Send Close Req"}
            </button>
            <button>Update Task</button>
          </div>
          <div className={classes.check}>
            <label htmlFor="semdEmail">
              <input
                type="checkbox"
                id="sendEmail"
                name="sendEmail"
                checked={checked}
                onChange={checkHandler}
                ref={checkRef}
              />
              Send Email
            </label>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default UpdatedDutyForm;
