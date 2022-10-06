import { useEffect, useState } from "react";
import { useContext } from "react";
import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import AuthForm from "./components/auth/AuthForm";

import GetReports from "./components/GetReports";
import GiveDuty from "./components/GiveDuty";
import Settings from "./components/Settings";
import StaffContext from "./components/store/staffContext";
import MainNavigation from "./ui/MainNavigation";

import { ref, onValue } from "firebase/database";
import { database } from "./firebase/firebaseConfig";

function App() {
  const {
    isLoggedIn,
    findAdminEmail,
    findStaff,
    uid,
    isManager,
    findDeptName,
  } = useContext(StaffContext);

  const [eMail, setEmail] = useState();

  const findDepartmentName = (email) => {
    setEmail(email);
  };

  useEffect(() => {
    const mainData = ref(database, "/" + uid);
    onValue(mainData, (snapshot) => {
      const data = snapshot.val();

      // updateStarCount(postElement, data);

      const units = [];
      const email = [];
      for (const key in data?.units) {
        const item = { id: key, ...data.units[key] };
        units.push(item);
      }
      for (const key in data?.adminemail) {
        const item = { id: key, ...data.adminemail[key] };
        email.push(item);
      }
      // console.log(units);
      findStaff(units);
      findAdminEmail(email);

      const dept = units?.filter((el) => el.email === eMail);
      console.log(dept[0]?.department);

      findDeptName(dept[0]?.department);
    });

    /*
    fetch(`${URL}.json`)
      .then((response) => response.json())
      .then((data) => {
        const units = [];
        const email = [];

        for (const key in data.units) {
          const item = { id: key, ...data.units[key] };
          units.push(item);
        }
        for (const key in data.adminemail) {
          const item = { id: key, ...data.adminemail[key] };
          email.push(item);
        }

        findStaff(units);
        findAdminEmail(email);
      })
      .catch((error) => {
        console.error("Error:", error);
      });*/
  }, [findAdminEmail, findStaff, findDeptName, isLoggedIn, uid, eMail]);

  return (
    <Fragment>
      <MainNavigation />
      <Routes>
        {!isLoggedIn && (
          <Fragment>
            <Route
              path="/"
              element={<AuthForm findDeptName={findDepartmentName} />}
            />
            <Route
              path="/login"
              element={<AuthForm findDeptName={findDepartmentName} />}
            />
          </Fragment>
        )}
        {isLoggedIn && (
          <Fragment>
            <Route path="/tasks" element={<GetReports />} />
            <Route
              path="/"
              element={isManager ? <GiveDuty /> : <GetReports />}
            />
            <Route path="/settings" element={isManager && <Settings />} />
          </Fragment>
        )}
      </Routes>
    </Fragment>
  );
}

export default App;
