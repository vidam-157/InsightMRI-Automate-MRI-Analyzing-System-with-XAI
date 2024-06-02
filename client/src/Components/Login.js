import React, { useEffect } from "react";
import "@fontsource/ubuntu";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { gapi, auth2 } from 'gapi-script';
import { setEmail, setUsername, setPropic } from '../Redux/SetAuthData';
import "./Login.css";

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect (() => {
        window.gapi.load("auth2", () => {
        window.gapi.auth2.init({
          client_id: "160617373173-2317fvfl8scdkfpbk5m5678b3i9ngdif.apps.googleusercontent.com",
          scope: "",
        });
      });
  },[]);

  function initGAPI() {
    return new Promise((resolve, reject) => {
      window.gapi.load('auth2', () => {
        resolve();
      });
    });
  }

  async function handleSignIn () {
    try {
      await initGAPI();
      window.gapi.auth2
      .getAuthInstance()
      .signIn({ scope: "profile email" })
      .then((res) => {
        const loggeduser = res.getBasicProfile();
        console.log(loggeduser);
        const Gname = loggeduser.getName();
        const Gmail = loggeduser.getEmail();
        const Gpic = loggeduser.getImageUrl();

        sessionStorage.setItem('userProfile', JSON.stringify({Gname, Gmail, Gpic}));

        dispatch(setUsername(loggeduser.getName()));
        dispatch(setEmail(loggeduser.getEmail()));
        dispatch(setPropic(loggeduser.getImageUrl()));

        navigate(`/submission/?w_id=1`)
      })
    }
    catch (err) {
      console.error(err)
    }
  }

  return (  
    <div className="login-page">
      <main className="main-content">
        <div className="welcome-section">
          <p className="head">InsightMRI</p>
          <h1 className="topic"><u>Exploring MRI - Unveiling Clarity</u></h1>
          <div className=" d-flex px-3 justify-content-center g-signin2" data-width="280" data-height="50" data-theme="dark" data-longtitle="true" 
                  onClick={() => (handleSignIn())}> </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
