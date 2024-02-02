/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { GoogleLogin } from "react-google-login";
import { useHistory } from "react-router-dom";
import { UrlConfig, AppConfig } from "../../../config";
import { Api, Network, CommonApiCall } from "../../../services";

import {
  UserAction,
  UserAuthenticationAction,
  AccountListAction,
} from "../../../reduxManager";
import CommonFunctions from "../../../utils/CommonFunctions";
import ParticlesBg from "particles-bg";
import { AiOutlineQuestion } from "react-icons/ai";
import { GoogleLoginComponent } from "../../shared";
import { FaRegHandPointRight } from "react-icons/fa";

const LoginForm = () => {
  // Router Functions
  const history = useHistory();
  // useStates
  const [isLoaderShow, setloader] = useState(false);
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });
  const [loginFailed, setLoginFailed] = useState(false);
  const [email, setEmail] = useState("");
  const [adminSiteUrl, setAdminSiteUrl] = useState(
    UrlConfig.externalUrls.adminProduction
  );
  const [getPascodeLoader, setGetPasscodeLoader] = useState(false);

  useEffect(() => {
    if (AppConfig) {
      // const adminUrl = AppConfig.isDevelopment ? UrlConfig.externalUrls.adminDeveloment : AppConfig.isStaging ? UrlConfig.externalUrls.adminStaging : UrlConfig.externalUrls.adminProduction;
      // setAdminSiteUrl(adminUrl);
    }
  }, []);

  // useState Manipulator
  const updateUser = (e) => {
    if (e.target.name === "password") {
      if (isNaN(e.target.value)) return false;
    }
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
  };

  // Prevent Form Submit
  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(userInput.email + userInput.password);
    handleLogin();
  };

  // Functions
  // Login with Email Function
  const handleLogin = () => {
    setloader(true);
    const payload = {
      emailOrPhone: userInput.email,
      password: userInput.password,
    };
    Api.postApi(UrlConfig.apiUrls.emailLoginUrl, payload)
      .then((response) => {
        console.log("**** response data", response.data);
        return response.data;
      })
      .then((data) => {
        setloader(false);
        if (data && data.length > 0) {
          const userSet = CommonFunctions.setUserAccountDetails(data);
          if (userSet) {
            history.push(UrlConfig.routeUrls.dashboard);
          }
          // setUserAccountDetails(data);
        } else {
          toast(`User data does not found `, {
            type: "error",
          });
        }
      })
      .catch((error) => {
        setloader(false);
        console.log("********Error request ", error.request);
        console.log("********error response ", error.response);
        if (error && error.request) {
          if (error.request.status !== 0) {
            if (
              error.response &&
              error.response.data &&
              error.response.data.errors
            ) {
              console.log("********Response response ", error.response);
              const { message } = error.response.data.errors[0];
              message === "Invalid Credentials"
                ? toast(`${message}`, {
                    type: "error",
                  })
                : toast(`User does not exist`, {
                    type: "error",
                  });
              console.log("********Response request ", message);
            }
          }
        }
      });
  };

  const responseGoogle = (response) => {
    setloader(true);
    const { tokenId, error } = response;
    if (error) {
      setloader(false);
      const errorMessage = error;
      console.log("errorMessage", errorMessage);
      if (errorMessage === "idpiframe_initialization_failed") {
        console.log("Cache issue");
      } else {
        toast(errorMessage, {
          type: "error",
        });
      }
    } else {
      if (tokenId) {
        CommonApiCall.loginWithGoogle(tokenId)
          .then((response) => {
            setloader(false);
            console.log("login successfully");
            history.push(UrlConfig.routeUrls.dashboard);
          })
          .catch((error) => {
            setloader(false);
            const errorMessage = CommonFunctions.apiErrorMessage(error);
            toast(errorMessage, {
              type: "error",
            });
          });
      }
    }
  };

  /**************** Set user account token details *************/
  const setUserAccountDetails = (data) => {
    const { accountUser, token, refreshToken } = data[0];
    const { user } = accountUser;
    const tokenDetails = { token: token, refreshToken: refreshToken };
    UserAction.setUserDetails(user);
    UserAuthenticationAction.setTokenDetails(tokenDetails);
    console.log("**** response token", token);
    console.log("**** response user", user);
    let accountList = [];
    data.map((dt) => {
      const { accountUser, token, refreshToken } = dt;
      const { account, accountUserType } = accountUser;
      const accountObj = {
        ...account,
        toke: token,
        refreshToken: refreshToken,
      };
      accountList.push(accountObj);
    });
    AccountListAction.setAccountList(accountList);
    Network.setToken(token);
    history.push(UrlConfig.routeUrls.dashboard);
  };

  // handle ResetPassword & GetOtp
  const handleResetPassword = () => {
    setGetPasscodeLoader(true);
    Api.postApi(UrlConfig.apiUrls.resetPassword, {
      emailOrPhone: userInput.email,
    })
      .then((response) => {
        setGetPasscodeLoader(false);
        toast.success(`${response.message} ! Check your email`, {});
      })
      .catch((error) => {
        setGetPasscodeLoader(false);
        if (error.request.status !== 0) {
          console.log(error.response);
          console.log(error.response.data.errors[0].message);
          toast.error(error.response.data.errors[0].message, {});
        } else {
          toast.info("check your internet", {});
        }
      });
  };

  // View Functions
  const googleLoginView = () => {
    return (
      <GoogleLogin
        // clientId="873054166059-n92de7p8dh1pochjl508edvpcq12hufc.apps.googleusercontent.com" //dev
        clientId="914586267151-d31mhpppvpbnee43j5kmb6asgo7qcnrj.apps.googleusercontent.com" //staging
        buttonText="Log in with google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
        theme="light"
        className="google-button hvr-float-shadow"
      />
    );
  };
  //--------------------------------------------------------------------------------------------------------
  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <ParticlesBg type="cobweb" bg={true} color="#18dcff" />
        <div className="row w-100 mx-0">
          <div className="col-lg-7 px-0 dispMDNone">
            <div className="left-side-img-bx">
              <img
                src={require("../../../assets/images/auth/login-bg.jpg")}
                className="login-half-bg"
                alt="Login Page Image"
              />
            </div>
          </div>
          <div className="col-lg-5 login-section-wrapper">
            <div className="auth-form-light">
              <div className="brand-logo">
                <img
                  src={require("../../../assets/images/SG_Logo.png")}
                  alt="logo"
                />
              </div>
              <h4 className="title-learning-app">LearningApp</h4>
              <Form className="pt-3" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <input
                    required
                    type="email"
                    name="email"
                    id="email"
                    value={userInput.email}
                    onChange={updateUser}
                    size="lg"
                    className="form-control"
                    placeholder=" "
                  />
                  <span className="highlight"></span>
                  <label className="form-control-placeholder" htmlFor="email">
                    Email address<sup>*</sup>
                  </label>
                </div>
                <div className="form-group">
                  <input
                    required
                    type="password"
                    name="password"
                    id="password"
                    maxLength="4"
                    minLength="4"
                    placeholder=""
                    value={userInput.password}
                    onChange={updateUser}
                    className="form-control"
                  />
                  <span className="highlight"></span>
                  <label className="form-control-placeholder" htmlFor="email">
                    4-digit Pass-Code<sup>*</sup>
                  </label>
                </div>
                <div className="mt-3">
                  <button
                    type="submit"
                    id="submit-button"
                    disabled={
                      userInput.email === "" || userInput.password === ""
                        ? true
                        : false
                    }
                    // block
                    className="btn btn-block btn-lg font-weight-medium auth-form-btn hvr-underline-from-left"
                  >
                    {" "}
                    Student log in (Existing user){" "}
                    {isLoaderShow && (
                      <Spinner size="sm" animation="grow" variant="success" />
                    )}
                  </button>
                </div>

                <div className="text-center mt-4 font-weight-light text-muted">
                  Don't have pass-code
                  <AiOutlineQuestion size={15} />
                  <Link
                    to="#"
                    className="text-primary"
                    onClick={() => {
                      if (userInput.email !== "") {
                        handleResetPassword(email);
                      } else {
                        toast("Enter your email", {
                          type: "error",
                        });
                      }
                    }}
                  >
                    Get OTP{" "}
                    {getPascodeLoader && (
                      <Spinner size="sm" animation="grow" variant="success" />
                    )}
                  </Link>
                </div>
                <div className="text-center mt-4 font-weight-light text-muted dispFlex">
                  <div className="hand-pointer shake">
                    <FaRegHandPointRight />
                  </div>
                  <span style={{ color: "#fff" }}>New user please</span>
                  <Link to="/register" className="text-primary">
                    {" "}
                    Sign up
                  </Link>
                </div>
                {/* <div className="mb-2">
                  <button type="button" className="btn btn-block btn-facebook">
                    <i className="mdi mdi-facebook mr-2"></i>Connect using facebook
                    </button>
                </div> */}
                <div className="mb-2">
                  <div className="loginWithGoogle">
                    {/* {googleLoginView()} */}
                    <GoogleLoginComponent responseGoogle={responseGoogle} />
                  </div>
                </div>
                <div className="text-center mt-4 font-weight-light text-muted">
                  <a
                    href={adminSiteUrl}
                    target="NOOPENER NOREFERRER"
                    className="text-primary"
                  >
                    {" "}
                    Login as institute
                  </a>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
