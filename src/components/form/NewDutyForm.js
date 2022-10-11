import { useContext, useRef, useState } from "react";
import classes from "./NewDutyForm.module.css";
import emailSend from "../email/emailSend";
import StaffContext from "../store/staffContext";
import Microphone from "../ui/Microphone";

function NewDutyForm(props) {
  const { staff } = useContext(StaffContext);

  const enteredUnit = useRef();
  const enteredDuty = useRef();
  const enteredDescription = useRef();
  const enteredDeadline = useRef();
  const dutyGivenDate = useRef();
  const dutyStatus = useRef();

  const [text, setText] = useState("");
  const [resetText, setResetText] = useState(false);

  const transcriptText = (textTemp) => {
    setText(textTemp);
  };

  const listedStaff = staff.map((el) => (
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

  function submitHandler(e) {
    e.preventDefault();

    selectedIndex = enteredUnit.current.selectedIndex;
    const selectedResponsible = enteredUnit.current[selectedIndex].value;
    const selectedOptgroup =
      enteredUnit.current[selectedIndex].parentElement.label;
    const emailName =
      enteredUnit.current[selectedIndex].parentElement.dataset.email;

    const dutyData = {
      title: "New Task",
      responsible: selectedResponsible,
      unit: selectedOptgroup,
      duty: enteredDuty.current.value,
      description: enteredDescription.current.value,
      updates: "",
      deadline: enteredDeadline.current.value,
      givenDate: dutyGivenDate.current.value,
      status: dutyStatus.current.value,
      email: emailName,
    };

    emailSend(dutyData);

    props.getDutyData(dutyData);

    setResetText((prev) => !prev);

    e.target.reset();
  }

  return (
    <div className={classes.card}>
      <form className={classes.form} onSubmit={submitHandler}>
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
              {listedStaff}
            </select>
          </div>

          <div className={classes.control}>
            <label htmlFor="duty">TASK</label>
            <input type="text" id="duty" ref={enteredDuty} required />
          </div>
          <div className={`${classes.control} ${classes.container}`}>
            <label htmlFor="description">DESCRIPTION</label>
            <textarea
              id="description"
              rows="5"
              defaultValue={text}
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
            <input type="date" id="deadline" ref={enteredDeadline} required />
          </div>
          <div className={classes.control}>
            <input
              type="hidden"
              id="givenDate"
              ref={dutyGivenDate}
              value={(() => {
                const date = new Date();
                const year = date.getFullYear();
                const month = `${date.getMonth() + 1}`.padStart(2, 0);
                const day = `${date.getDate()}`.padStart(2, 0);
                return year + "-" + month + "-" + day;
              })()}
            />
          </div>
          <div className={classes.control}>
            <input type="hidden" id="status" ref={dutyStatus} value={false} />
          </div>
          <div className={classes.actions}>
            <button>Add Task</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default NewDutyForm;
