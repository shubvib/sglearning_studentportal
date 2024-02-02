import React, { useEffect } from 'react';
import { GoogleLogin } from "react-google-login";

const GoogleLoginComponent = (props) => {

    const { responseGoogle } = props;

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
    )

}

export default GoogleLoginComponent;