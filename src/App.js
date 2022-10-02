import { useEffect } from "react";
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
  console.log(JSON.parse("false"));
  const { isLoggedIn, findAdminEmail, findStaff, uid } =
    useContext(StaffContext);

  useEffect(() => {
    const mainData = ref(database, "/" + uid);
    onValue(mainData, (snapshot) => {
      const data = snapshot.val();

      // updateStarCount(postElement, data);

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
  }, [findAdminEmail, findStaff, isLoggedIn, uid]);

  return (
    <Fragment>
      <MainNavigation />
      <Routes>
        {!isLoggedIn && <Route path="/login" element={<AuthForm />} />}
        {isLoggedIn && (
          <Fragment>
            <Route path="/tasks" element={<GetReports />} />
            <Route path="/" element={<GiveDuty />} />
            <Route path="/settings" element={<Settings />} />
          </Fragment>
        )}
      </Routes>
    </Fragment>
  );
}

export default App;
