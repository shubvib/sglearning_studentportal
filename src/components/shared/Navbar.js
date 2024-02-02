import React, { useEffect } from 'react';
import { Dropdown, Media } from 'react-bootstrap';
import { UserAction, UserAuthenticationAction, AppThemeAction } from '../../reduxManager';
import { UrlConfig } from '../../config';
import { getStore } from '../../reduxManager';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import { Network } from '../../services';
import CommonFunctions from '../../utils/CommonFunctions';
import AppTheme from './AppTheme';
import assets from '../../assets';

const Navbar = (props) => {
  const { accountList } = props
  useEffect(() => {

  }, [props.accountList])


  const history = useHistory();
  const currentTheme = AppTheme[props.appTheme];

  currentTheme && console.log('currentTheme', currentTheme.backgroundColor)

  const toggleOffcanvas = () => {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');

  }
  const logout = () => {
    // Network.setToken('');
    // UserAction.resetUserDetails();
    // UserAuthenticationAction.resetTokenDetails();
    const resetData = CommonFunctions.resetStorage();
    if (resetData) {
      history.push(UrlConfig.routeUrls.loginUrl);
    }

  }

  const changeTheme = () => {
    // const currentTheme = AppTheme[theme];
    // backgroundColor: `${currentTheme.backgroundColor}`,
    // console.log('props.appTheme', props.appTheme)
    const setTheme = props.appTheme === 'light' ? 'dark' : 'light';
    AppThemeAction.setAppTheme(setTheme);
    document.documentElement.setAttribute('data-theme', setTheme);

  }

  return (
    <nav className="navbar col-lg-12 col-12 p-lg-0 fixed-top d-flex flex-row">
      {/* <nav className="navbar col-lg-12 col-12 p-lg-0 fixed-top d-flex flex-row" style={{ backgroundColor: `${currentTheme ? currentTheme.backgroundColor : '#fff'}` }}> */}
      <div className="navbar-menu-wrapper d-flex align-items-center justify-content-between">
        <a className="navbar-brand brand-logo-mini align-self-center d-lg-none" href="javascript:void(0);" onClick={evt => evt.preventDefault()}><img src={require("../../assets/images/SGlearningapp-mini-logo.png")} alt="logo" /></a>
        <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={() => document.body.classList.toggle('sidebar-icon-only')}>
          <i className="mdi mdi-menu"></i>
        </button>
        <div className="institute-name-logo-box">


        </div>
        <ul className="navbar-nav navbar-nav-right ml-lg-auto">
          <li className="nav-item  nav-profile border-0 pl-4">
            <div className="toggleWrapper">
              <input type="checkbox" className="dn" id="dn" onChange={() => {
                changeTheme();
              }} />
              <label for="dn" className="toggle-switcher">
                <span className="toggle__handler">
                  <span className="crater crater--1"></span>
                  <span className="crater crater--2"></span>
                  <span className="crater crater--3"></span>
                </span>
                <span className="star star--1"></span>
                <span className="star star--2"></span>
                <span className="star star--3"></span>
                <span className="star star--4"></span>
                <span className="star star--5"></span>
                <span className="star star--6"></span>
              </label>
            </div>
          </li>
          <li className="nav-item  nav-profile border-0 pl-4">
            {/* <Dropdown alignRight>
              <Dropdown.Toggle className="nav-link count-indicator p-0 toggle-arrow-hide bg-transparent">
                <i className="mdi mdi-bell-outline"></i>
                <span className="count danger">4</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="navbar-dropdown preview-list">
                <Dropdown.Item className="dropdown-item py-3 d-flex align-items-center" href="!#" onClick={evt => evt.preventDefault()}>
                  <p className="mb-0 font-weight-medium float-left">You have 4 new notifications </p>
                  <span className="badge badge-pill badge-primary float-right">View all</span>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center" href="!#" onClick={evt => evt.preventDefault()}>
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-alert m-auto text-primary"></i>
                  </div>
                  <div className="preview-item-content py-2">
                    <h6 className="preview-subject font-weight-normal text-dark mb-1">Application Error</h6>
                    <p className="font-weight-light small-text mb-0"> Just now </p>
                  </div>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center" href="!#" onClick={evt => evt.preventDefault()}>
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-settings m-auto text-primary"></i>
                  </div>
                  <div className="preview-item-content py-2">
                    <h6 className="preview-subject font-weight-normal text-dark mb-1">Settings</h6>
                    <p className="font-weight-light small-text mb-0"> Private message </p>
                  </div>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center" href="!#" onClick={evt => evt.preventDefault()}>
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-airballoon m-auto text-primary"></i>
                  </div>
                  <div className="preview-item-content py-2">
                    <h6 className="preview-subject font-weight-normal text-dark mb-1">New user registration</h6>
                    <p className="font-weight-light small-text mb-0"> 2 days ago </p>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
          </li>
          <li className="nav-item  nav-profile border-0">
            <Dropdown alignRight>
              <Dropdown.Toggle className="nav-link count-indicator bg-transparent">
                <span className="profile-text">{props.userData && `${props.userData.name}`}</span>
                <img className="img-xs " src={props.userData && props.userData.profileImage ? { uri: props.userData.profileImage } : assets.images.studentDefaultImage} alt="Profile" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="preview-list navbar-dropdown pb-3">
                <Dropdown.Item className="dropdown-item p-0 preview-item d-flex align-items-center border-bottom" href="!#" onClick={evt => evt.preventDefault()}>
                  <div className="d-flex">
                    <div className="py-3 px-4 d-flex align-items-center justify-content-center">
                      <i className="mdi mdi-bookmark-plus-outline mr-0"></i>
                    </div>
                    <div className="py-3 px-4 d-flex align-items-center justify-content-center border-left border-right" onClick={evt => {
                   history.push(UrlConfig.routeUrls.UpdateProfile);
                }}>
                      <i className="mdi mdi-account-outline mr-0"></i>
                    </div>
                    <div className="py-3 px-4 d-flex align-items-center justify-content-center">
                      <i className="mdi mdi-alarm-check mr-0"></i>
                    </div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center border-0 mt-2" onClick={evt => {
                   history.push(UrlConfig.routeUrls.ResetPassword);
                }}>
                  Reset Password
                  </Dropdown.Item>
                {/* <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center border-0" onClick={evt => evt.preventDefault()}>
                  Change Password
                  </Dropdown.Item>
                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center border-0" onClick={evt => evt.preventDefault()}>
                  Check Inbox
                  </Dropdown.Item> */}
                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center border-0" onClick={evt => logout()}>
                  Sign Out
                  </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={toggleOffcanvas}>
          <span className="mdi mdi-menu"></span>
        </button>
      </div>
    </nav >
  );

}

const mapPropsToState = (state) => {
  return {
    userData: state.userData,
    accountList: state.accountList[0],
    appTheme: state.appTheme
  }
}
export default connect(mapPropsToState)(Navbar);

// export default Navbar;
