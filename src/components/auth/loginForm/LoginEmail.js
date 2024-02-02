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

const LoginEmail = (props) => {
  const { setFlagForAuth, setUserEmail, userEmail } = props;
  const history = useHistory();
  const [isLoaderShow, setloader] = useState(false);
  const [userInput, setUserInput] = useState({
    email: userEmail ? userEmail : "",
    mobile: userEmail.includes("@") ? "+91" : userEmail ? userEmail : "+91",
  });
  const [email, setEmail] = useState("");
  const [adminSiteUrl, setAdminSiteUrl] = useState(
    UrlConfig.externalUrls.adminProduction
  );
  const [getPascodeLoader, setGetPasscodeLoader] = useState(false);
  const [flagOfValidation, setFlagOfValidation] = useState(true);
  const [emailOrPhone, setEmailOrPhone] = useState(false);
  // useState Manipulator
  const updateUser = (e) => {
    if (e.target.name === "mobile") {
      if (!e.target.value.includes("+91")) return false;
      if (isNaN(e.target.value)) return false;
    }
    e.target.value = e.target.value.trim();
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    if (AppConfig) {
      // const adminUrl = AppConfig.isDevelopment ? UrlConfig.externalUrls.adminDeveloment : AppConfig.isStaging ? UrlConfig.externalUrls.adminStaging : UrlConfig.externalUrls.adminProduction;
      // setAdminSiteUrl(adminUrl);
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem("mobile");
  }, []);

  // Prevent Form Submit
  const handleFormSubmit = (event) => {
    userInput.email.trim() === ""
      ? localStorage.setItem("mobile", userInput.mobile)
      : localStorage.setItem("email", userInput.email);
    event.preventDefault();
    let isValid = false;
    if (userInput.email.includes("@")) {
      if (userInput.email.trim() === "") return false;
      isValid = validateEmail(userInput.email);
      console.log("userInput.email", userInput.email, "isvalid", isValid);
    } else {
      if (userInput.mobile.trim() === "+91") return false;
      isValid = validateNumber(userInput.mobile);
      console.log("userInput.phone", userInput.mobile);
    }
    if (isValid) {
      handleLogin();
    } else {
      const errorMessage = "Invalid user name.";
      toast(errorMessage, {
        type: "error",
      });
    }
  };

  const handleLogin = () => {
    setloader(true);
    const payload = {
      emailOrPhone: userInput.email ? userInput.email : userInput.mobile,
    };
    Api.postApi(UrlConfig.apiUrls.isUserExist, payload)
      .then((response) => {
        const { data } = response;
        console.log("**** response data", response);
        return data;
      })
      .then((data) => {
        console.log("data", data);
        if (data) {
          setloader(false);
          userInput.email
            ? setUserEmail(userInput.email)
            : setUserEmail(userInput.mobile);
          setFlagForAuth(true);
          setFlagOfValidation(true);
        } else {
          setFlagOfValidation(false);
          const errorMessage = `User does not exist`;
          toast(errorMessage, {
            type: "error",
          });
        }
        setloader(false);
      })
      .catch((error) => {
        setloader(false);
        setFlagOfValidation(false);
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        toast(errorMessage, {
          type: "error",
        });
      });
  };

  const validateEmail = (userEmail) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(userEmail).toLowerCase());
  };
  const validateNumber = (userMobile) => {
    var re = /^[+][0-9]*$/;
    if (!re.test(userMobile)) {
      return false;
    } else {
      return true;
    }
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
              <div className="email-mobile-box-wrap">
                <div>
                  <label htmlFor="email">
                    <input
                      type="radio"
                      name="email-or-phone"
                      autoFocus={true}
                      defaultChecked
                      onChange={() => {
                        setUserInput({ ...userInput, mobile: "+91" });
                        setEmailOrPhone(false);
                        localStorage.removeItem("mobile");
                      }}
                      //value={}
                      id="email"
                    />{" "}
                    email
                  </label>
                </div>
                <div>
                  <label htmlFor="phone">
                    <input
                      type="radio"
                      name="email-or-phone"
                      onChange={() => {
                        setUserInput({ ...userInput, email: "" });
                        setEmailOrPhone(true);
                        localStorage.removeItem("mobile");
                      }}
                      //value={}
                      id="phone"
                    />{" "}
                    mobile
                  </label>
                </div>
              </div>
              <Form className="pt-3" onSubmit={handleFormSubmit}>
                {emailOrPhone ? (
                  <div className="form-group">
                    {/* <input
                                            required
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={userInput.email}
                                            autoFocus={true}
                                            onChange={updateUser} size="lg" className={flagOfValidation ? "form-control" : " form-control border-btm-change-color"} placeholder=" "
                                        />
                                        <span className="highlight"></span>
                                        <label className="form-control-placeholder" htmlFor="email">Email<sup>*</sup></label> */}
                    <input
                      required
                      type="text"
                      name="mobile"
                      id="mobile"
                      autoFocus={true}
                      value={userInput.mobile}
                      onChange={updateUser}
                      size="lg"
                      className={
                        flagOfValidation
                          ? "form-control"
                          : " form-control border-btm-change-color"
                      }
                      placeholder=" "
                      maxLength={13}
                      minLength={13}
                    />
                    <span className="highlight"></span>
                    <label
                      className="form-control-placeholder"
                      htmlFor="mobile"
                    >
                      Mobile<sup>*</sup>
                    </label>
                  </div>
                ) : (
                  <div className="form-group">
                    <input
                      required
                      type="email"
                      name="email"
                      id="email"
                      value={userInput.email}
                      autoFocus={true}
                      onChange={updateUser}
                      size="lg"
                      className={
                        flagOfValidation
                          ? "form-control"
                          : " form-control border-btm-change-color"
                      }
                      placeholder=" "
                    />
                    <span className="highlight"></span>
                    <label className="form-control-placeholder" htmlFor="email">
                      Email<sup>*</sup>
                    </label>
                  </div>
                )}
                {!flagOfValidation && (
                  <span
                    className="register-link"
                    style={{ textAlign: "right", display: "block" }}
                  >
                    <Link to="/register" className="text-primary">
                      {" "}
                      Register here
                    </Link>
                  </span>
                )}
                <div className="mt-3">
                  <button
                    type="submit"
                    id="submit-button"
                    // onClick={handleFormSubmit}
                    className={`${
                      (userInput.mobile === "+91" && userInput.email === "") ||
                      (emailOrPhone && userInput.mobile.length < 13)
                        ? "btn btn-block btn-lg font-weight-medium auth-form-btn hvr-underline-from-left disabled"
                        : "btn btn-block btn-lg font-weight-medium auth-form-btn hvr-underline-from-left"
                    }`}
                  >
                    {" "}
                    Login or Register Here{" "}
                    {isLoaderShow && (
                      <Spinner size="sm" animation="grow" variant="success" />
                    )}
                  </button>
                </div>

                {/* <div className="text-center mt-4 font-weight-light text-muted">
                                    Don't have pass-code<AiOutlineQuestion size={15} />
                                    <Link to="#" className="text-primary" onClick={() => {
                                        if (userInput.email !== "") {
                                            handleResetPassword(email);
                                        } else {
                                            toast("Enter your email", {
                                                type: "error"
                                            })
                                        }

                                    }} >Get OTP {getPascodeLoader && <Spinner size="sm" animation="grow" variant="success" />}
                                    </Link>
                                </div>
                <div className="mb-2">
                                    <div className="loginWithGoogle">
                                        <GoogleLoginComponent responseGoogle={responseGoogle} />
                                    </div>
                                </div>
                <div className="text-center mt-4 font-weight-light text-muted">

                                    <a href={adminSiteUrl} target="NOOPENER NOREFERRER" className="text-primary" > Login as institute</a>
                                </div> */}
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginEmail;
