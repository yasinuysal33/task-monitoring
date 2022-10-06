import { useCallback, useEffect, useState } from "react";
import { createContext } from "react";

import { getAuth, signOut } from "firebase/auth";

let logoutTimer;

const StaffContext = createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  staff: [],
  adminEmail: [],
  URL: "",
  uid: "",
  isManager: true,
  deptName: "",
  findStaff: () => {},
  findAdminEmail: () => {},
  findDeptName: () => {},
});

const calculateRamainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();

  const remainingDuration = expirationTime - currentTime;

  return remainingDuration;
};

const retrieveLocalStorage = () => {
  const storedManagerState = localStorage.getItem("isManager") === "true";
  const storedDepartment = localStorage.getItem("deptName");
  const storedToken = localStorage.getItem("token");
  const storedUid = localStorage.getItem("uid");
  const storedExpirationTime = localStorage.getItem("expirationTime");

  const remainingTime = calculateRamainingTime(storedExpirationTime);

  if (remainingTime <= 5000) {
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("isManager");
    localStorage.removeItem("deptName");
    return null;
  }
  return {
    token: storedToken,
    uid: storedUid,
    duration: remainingTime,
    managerState: storedManagerState,
    department: storedDepartment,
  };
};

export function StaffContextProvider(props) {
  const auth = getAuth();
  const localStorageData = retrieveLocalStorage();
  let initialToken, initialUid, initialManagerState, initialDepartment;
  if (localStorageData) {
    initialToken = localStorageData.token;
    initialUid = localStorageData.uid;
    initialManagerState = localStorageData.managerState;
    initialDepartment = localStorageData.department;
  }

  const [token, setToken] = useState(initialToken);
  const [uid, setUid] = useState(initialUid);
  const [fetchedStaff, setFetchedStaff] = useState([]);
  const [fetchedAdminEmail, setFetchedAdminEmail] = useState([]);
  const [fetchedDeptName, setFetchedDeptName] = useState(initialDepartment);
  const [isManager, setIsManager] = useState(initialManagerState);

  const userIsLoggedIn = !!token; //if token is empty retruns false, if not else returns true.

  const logoutHandler = useCallback(() => {
    setToken(null);
    setUid(null);
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("isManager");
    localStorage.removeItem("deptName");
    setFetchedAdminEmail([]);
    setFetchedStaff([]);
    clearTimeout(logoutTimer);
    signOut(auth)
      .then(() => {
        console.log("Sign-out successful");
      })
      .catch((error) => {
        alert(error.code, error.message);
      });
  }, [auth]);

  const loginHandler = (token, uid, expirationTime, managerState) => {
    setToken(token);
    setUid(uid);
    setIsManager(managerState);
    localStorage.setItem("token", token);
    localStorage.setItem("uid", uid);
    localStorage.setItem("isManager", managerState);

    const remainingTime = calculateRamainingTime(expirationTime);
    // console.log(remainingTime);
    localStorage.setItem("expirationTime", expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (localStorageData) {
      // console.log(localStorageData.duration);
      logoutTimer = setTimeout(logoutHandler, localStorageData.duration);
    }
  }, [localStorageData, logoutHandler]);

  const findStaffHandler = useCallback((data) => {
    setFetchedStaff(data);
  }, []);

  const findAdminEmailHandler = useCallback((data) => {
    setFetchedAdminEmail(data);
  }, []);

  const findDeptNameHandler = useCallback(
    (data) => {
      !localStorageData?.department && localStorage.setItem("deptName", data);
      !localStorageData?.department
        ? setFetchedDeptName(data)
        : setFetchedDeptName(localStorageData.department);
    },
    [localStorageData?.department]
  );

  const context = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    staff: fetchedStaff,
    adminEmail: fetchedAdminEmail,
    uid: uid,
    isManager: isManager,
    deptName: fetchedDeptName,
    findDeptName: findDeptNameHandler,

    URL: "https://tasks-87a69-default-rtdb.firebaseio.com/",
    findStaff: findStaffHandler,
    findAdminEmail: findAdminEmailHandler,
  };

  return (
    <StaffContext.Provider value={context}>
      {props.children}
    </StaffContext.Provider>
  );
}

export default StaffContext;
