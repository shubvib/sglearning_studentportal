import React, { useState, useEffect } from "react";
import ParticlesBg from "particles-bg";
import { Form, Spinner } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { Api } from "../../../services";
import { UrlConfig } from "../../../config";
import CommonFunctions from "../../../utils/CommonFunctions";
import { toast } from "react-toastify";
import { AiOutlineQuestion } from "react-icons/ai";

const LoginPassword = (props) => {
  const { userEmail, setFlagForAuth, setUserEmail } = props;
  const history = useHistory();
  /******************************************usestate Start Here********************************************************************/
  const [userInput, setUserInput] = useState({
    password: "",
    email: "",
  });
  const [isLoaderShow, setLoader] = useState(false);
  const [getPascodeLoader, setGetPasscodeLoader] = useState(false);
  /******************************************usestate End Here********************************************************************/

  /****************************************** UseEffect for email Start********************************************************************/
  useEffect(() => {
    userEmail && setUserInput({ ...userInput, email: userEmail });
  }, [userEmail]);

  /****************************************** UseEffect for email end********************************************************************/

  /******************************************onchange Update Start Here********************************************************************/

  const updateUser = (e) => {
    if (isNaN(e.target.value)) return false;
    e.target.value = e.target.value.trim();
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
  };

  /******************************************onchange Update End Here********************************************************************/

  /******************************************onSubmit and API Call Start Here*****************************************************************/
  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(userInput.password);
    handleLogin();
  };
  const handleLogin = () => {
    setLoader(true);
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
        setLoader(false);
        if (data && data.length > 0) {
          const userSet = CommonFunctions.setUserAccountDetails(data);
          if (userSet) {
            history.push(UrlConfig.routeUrls.exam);
          }
          // setUserAccountDetails(data);
        } else {
          toast(`User data does not found `, {
            type: "error",
          });
        }
      })
      .catch((error) => {
        setLoader(false);
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
  /******************************************onSubmit and API Call End Here***************************************************************/

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
                <div
                  className="form-group"
                  onClick={() => {
                    setUserEmail(userEmail);
                    setFlagForAuth(false);
                  }}
                >
                  <input
                    required
                    type={userEmail.includes("@") ? "email" : "text"}
                    name="email"
                    id="email"
                    placeholder=""
                    value={userEmail && userEmail}
                    className="form-control"
                  />
                  <span className="highlight"></span>
                  <label className="form-control-placeholder" htmlFor="email">
                    Email/Phone<sup>*</sup>
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
                  <label
                    className="form-control-placeholder"
                    htmlFor="password"
                  >
                    Enter Pass-Code<sup>*</sup>
                  </label>
                </div>

                <div className="mt-3">
                  <button
                    type="submit"
                    id="submit-button"
                    className="btn btn-block btn-lg font-weight-medium auth-form-btn hvr-underline-from-left"
                  >
                    {" "}
                    Sign-In{" "}
                    {isLoaderShow && (
                      <Spinner size="sm" animation="grow" variant="success" />
                    )}
                  </button>
                </div>
                {/* <div className="text-center mt-4 font-weight-light text-muted">
                                    Don't have pass-code<AiOutlineQuestion size={15} />
                                    <Link to="#" className="text-primary" onClick={() => {
                                        if (userInput.email !== "") {
                                            handleResetPassword();
                                        } else {
                                            toast("Enter your email", {
                                                type: "error"
                                            })
                                        }

                                    }} >Get OTP {getPascodeLoader && <Spinner size="sm" animation="grow" variant="success" />}
                                    </Link>
                                </div> */}
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPassword;
