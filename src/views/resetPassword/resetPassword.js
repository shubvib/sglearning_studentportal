import React, { useState, useEffect } from 'react';
import ParticlesBg from 'particles-bg'
import { Form, Spinner } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

import { AiOutlineQuestion } from 'react-icons/ai';

import { UrlConfig, AppConfig } from '../../config';
import { Api, Network, CommonApiCall } from '../../services';
import { toast } from "react-toastify";

import { UserAction, UserAuthenticationAction, AccountListAction } from '../../reduxManager';
import CommonFunctions from '../../utils/CommonFunctions';
import { connect } from 'react-redux';
const ResetPassword = (props) => {
    const { userData } = props;
    console.log(props, 'Props')
    const [getPascodeLoader, setGetPasscodeLoader] = useState(false);
    const [userInput, setUserInput] = useState({
        oldPasscode: '',
        newPasscode: '',
        confirmPasscode: ''

    });
    const [isLoaderShow, setLoader] = useState(false);



    const handleResetPassword = () => {
        setGetPasscodeLoader(true);
        Api.postApi(UrlConfig.apiUrls.resetPassword, { emailOrPhone: userData.userName })
            .then((response) => {
                setGetPasscodeLoader(false);
                toast.success(`${response.message} ! Check your Email or Mobile`, {});
                toast.success(`Your Passcode is 8910`, {});

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

    const updatePassCode = () => {
        setLoader(true);
        let payload = {
            oldPassword: userInput.oldPasscode,
            newPassword: userInput.newPasscode,
        };
        Api.postApi(UrlConfig.apiUrls.updatePassword, payload)
            .then(response => {
                setLoader(false);
                console.log('**** response', response);
                // alert(JSON.stringify(response));
                return response;
            })
            .then(data => {
                if (data) {

                    // alert(data.message);
                    toast.success('Passcode Updated Successfully.');
                    setUserInput({
                        oldPasscode: '',
                        newPasscode: '',
                        confirmPasscode: ''
                    })
                }
            })
            .catch(error => {
                setLoader(false);
                // seterrorUsername(true);
                const { message } = error.response.data.errors[0];
                // setErrorMessage(message);
                toast.error(message)
            });
    };


    return (

        <div>
            <div className="d-flex align-items-center auth px-0">
                {/* <ParticlesBg type="cobweb" bg={true} color="#18dcff" /> */}
                <div className="row w-100 mx-0">
                    <div className="col-lg-3 px-0 dispMDNone">

                    </div>
                    <div className="col-lg-6 login-section-wrapper">
                        <div className="auth-form-light">

                            <h4 className="title-learning-app">Reset Password</h4>

                            <Form className="pt-3" onSubmit={(e) => {
                                e.preventDefault();
                                if (userInput.newPasscode == userInput.confirmPasscode) {
                                    updatePassCode()
                                } else {
                                    toast.error('Password not match')
                                }
                                // alert('pk')
                            }}>


                                <div className="form-group">
                                    <input
                                        required
                                        type="otp"
                                        name="oldPasscode"
                                        id="oldPasscode"
                                        autoFocus={true}
                                        value={userInput.oldPasscode}
                                        onChange={(e) => {
                                            console.log(e)
                                            setUserInput({ ...userInput, oldPasscode: e.target.value });
                                        }} size="lg" className={" form-control"} placeholder=" "
                                        maxLength={4}
                                        minLength={4}
                                    />
                                    <span className="highlight"></span>
                                    <label className="form-control-placeholder" htmlFor="mobile">Enter Old Passcode<sup>*</sup></label>
                                </div>
                                <div className="text-center mt-4 font-weight-light text-muted">
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
                                </div>
                                <div className="text-center mt-4 font-weight-light text-muted"></div>
                                <div className="form-group">
                                    <input
                                        required
                                        type="otp"
                                        name="newPasscode"
                                        id="newPasscode"
                                        autoFocus={true}
                                        value={userInput.newPasscode}
                                        onChange={(e) => {
                                            setUserInput({ ...userInput, newPasscode: e.target.value });
                                        }} size="lg" className={" form-control"} placeholder=" "
                                        maxLength={4}
                                        minLength={4}
                                    />
                                    <span className="highlight"></span>
                                    <label className="form-control-placeholder" htmlFor="mobile">Enter New Passcode<sup>*</sup></label>
                                </div>

                                <div className="form-group">
                                    <input
                                        required
                                        type="otp"
                                        name="cPasscode"
                                        id="cPasscode"
                                        autoFocus={true}
                                        value={userInput.confirmPasscode}
                                        onChange={(e) => {
                                            setUserInput({ ...userInput, confirmPasscode: e.target.value });
                                        }} size="lg" className={" form-control"} placeholder=" "
                                        maxLength={4}
                                        minLength={4}
                                    />
                                    <span className="highlight"></span>
                                    <label className="form-control-placeholder" htmlFor="mobile">Enter Confirm Passcode<sup>*</sup></label>
                                </div>

                                <div className="mt-3">
                                    <button
                                        type="submit"
                                        id="submit-button"
                                        // onClick={handleFormSubmit}
                                        className={"btn btn-block btn-lg font-weight-medium auth-form-btn hvr-underline-from-left"}> Submit{isLoaderShow && <Spinner size="sm" animation="grow" variant="success" />}</button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>


        </div>




    )
}


const mapPropsToState = (state) => {
    return {
        userData: state.userData,
    }
}
export default connect(mapPropsToState)(ResetPassword);

