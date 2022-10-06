import { useContext, useRef, useState } from "react";
import StaffContext from "../store/staffContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import classes from "./AuthForm.module.css";

const AuthForm = (props) => {
  const auth = getAuth();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const checkRef = useRef();
  const navigate = useNavigate();

  const { login } = useContext(StaffContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const checkHandler = () => {
    setChecked((prev) => !prev);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    const signType = isLogin
      ? signInWithEmailAndPassword
      : createUserWithEmailAndPassword;

    signType(auth, enteredEmail, enteredPassword)
      .then((response) => {
        setIsLoading(false);

        console.log(response.user.email);
        props.findDeptName(response.user.email);
        login(
          response.user.accessToken,
          checked ? response.user.uid : "Ee5si3B4eaPoMvh32eRiJg2OyIp2",
          response.user.stsTokenManager.expirationTime,
          checked
        );

        navigate("/");
      })
      .catch((err) => {
        alert(err.code, err.message);
      });

    /*
    let url;
    
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCbdcWaqYEnCSOAshTAofyzXp0ClB-YsAY";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCbdcWaqYEnCSOAshTAofyzXp0ClB-YsAY";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
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
        // console.log(data);
        login(data.idToken);
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
      */
  };
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            required
            ref={emailInputRef}
            defaultValue="@gmail.com"
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.check}>
          <label htmlFor="admin">
            <input
              type="checkbox"
              id="admin"
              name="admin"
              checked={checked}
              onChange={checkHandler}
              ref={checkRef}
            />
            Login as Manager
          </label>
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <LoadingSpinner />}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
