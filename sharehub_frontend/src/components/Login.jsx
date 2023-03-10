import React from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

// assets
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logo_sharehub_white.png";

// google auth
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

// sanity client
import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (credentialResponse) => {
    // decode the secret message from credentialResponse.credential using jwt_decode
    const response = { ...jwt_decode(credentialResponse.credential) };

    // save the user data to localstorage
    localStorage.setItem("user", JSON.stringify(response));

    // take the user name, picture and sub (unique token)
    const { name, picture, sub } = response;

    console.log(name, picture, sub);

    // prepare user data for saving into sanity
    const doc = {
      _id: sub,
      _type: "user",
      userName: name,
      image: picture,
    };

    // create user data into sanity
    client.createIfNotExists(doc).then(() => navigate("/", { replace: true }));
  };

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_REACT_APP_GOOGLE_API_TOKEN}
    >
      <div className="flex justify-start items-center flex-col h-screen">
        <div className="relative w-full h-full">
          <video
            src={shareVideo}
            type="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
            className="w-full h-full object-cover"
          />

          <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
            <div className="p-5">
              <img src={logo} width="130px" alt="logo" />
            </div>
            <div className="shadow-2xl">
              <GoogleLogin
                onSuccess={responseGoogle}
                onError={responseGoogle}
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
