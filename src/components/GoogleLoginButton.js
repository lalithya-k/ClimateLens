import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {
    return (
        <GoogleOAuthProvider clientId="48914486228-t0l4md4aiol9u5hd7s7v7ddf0mfec4k1.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={(response) => {
                    console.log("Login Success:", response);
                }}
                onError={() => {
                    console.log("Login Failed");
                }}
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
