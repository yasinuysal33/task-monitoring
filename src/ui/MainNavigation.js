import { Link } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import {
  RiHome3Line,
  RiDraftLine,
  RiSettings5Line,
  RiLoginBoxLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import { BsPencilSquare } from "react-icons/bs";
import { Fragment, useContext } from "react";
import StaffContext from "../components/store/staffContext";

function MainNavigation() {
  const { isLoggedIn, logout, isManager } = useContext(StaffContext);

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link className={classes.centered} to={isManager ? "/" : "/tasks"}>
          <RiHome3Line
            style={{
              marginRight: "8px",
              fontSize: "150%",
            }}
          />
          ADF TASKS
        </Link>
      </div>
      <nav>
        <ul>
          {isLoggedIn && (
            <Fragment>
              <li>
                {isManager && (
                  <Link className={classes.centered} to="/">
                    <BsPencilSquare
                      style={{
                        marginRight: "8px",
                        fontSize: "150%",
                      }}
                    />
                    Assign Task
                  </Link>
                )}
              </li>

              <li>
                <Link className={classes.centered} to="/tasks">
                  <RiDraftLine
                    style={{
                      marginRight: "8px",
                      fontSize: "150%",
                    }}
                  />{" "}
                  See Tasks
                </Link>
              </li>
              <li>
                {isManager && (
                  <Link className={classes.centered} to="/settings">
                    <RiSettings5Line
                      style={{
                        marginRight: "8px",
                        fontSize: "150%",
                      }}
                    />
                  </Link>
                )}
              </li>
              <li
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              >
                <Link className={classes.centered} to="/login">
                  <RiLogoutBoxRLine
                    style={{
                      marginRight: "8px",
                      fontSize: "150%",
                    }}
                  />
                </Link>
              </li>
            </Fragment>
          )}
          {!isLoggedIn && (
            <li>
              <Link className={classes.centered} to="/login">
                <RiLoginBoxLine
                  style={{
                    marginRight: "8px",
                    fontSize: "150%",
                  }}
                />
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
