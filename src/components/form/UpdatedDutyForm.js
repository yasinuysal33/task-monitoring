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

  const staffCtx = useContext(StaffContext);

  const [text, setText] = useState("");
  const [resetText, setResetText] = useState(false);

  const transcriptText = (textTemp) => {
    setText(props.updatingItem.description + " " + textTemp);
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

  function deleteHandler(e) {
    e.preventDefault();

    props.deleteDuty();

    // e.target.reset();
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
      id: props.updatingItem.id,
      responsible: selectedResponsible,
      unit: selectedOptgroup,
      duty: enteredDuty.current.value,
      description: enteredDescription.current.value,
      deadline: enteredDeadline.current.value,
      givenDate: props.updatingItem.givenDate,
      updatedDate: dutyUpdatedDate.current.value,
      status: dutyStatus.current.value,
      email: emailName,
    };

    emailSend(dutyData);

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
            ></textarea>{" "}
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
            <button onClick={deleteHandler}>Delete Task</button>
            <button>Update Task</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default UpdatedDutyForm;
