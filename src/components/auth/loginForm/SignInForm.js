/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import LoginEmail from "./LoginEmail";
import LoginPassword from "./LoginPassword";

const SignIn = (props) => {
  const [flagForAuth, setFlagForAuth] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  return flagForAuth ? (
    <LoginPassword
      userEmail={userEmail}
      setFlagForAuth={setFlagForAuth}
      setUserEmail={setUserEmail}
    />
  ) : (
    <LoginEmail
      setFlagForAuth={setFlagForAuth}
      setUserEmail={setUserEmail}
      userEmail={userEmail}
    />
  );
};
//-----------------------------------LoginPassword Component End Here---------------------------------------
export default SignIn;
