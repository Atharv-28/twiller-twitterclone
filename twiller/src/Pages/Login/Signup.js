import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import twitterimg from "../../image/twitter.jpeg";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../../context/UserAuthContext";
import "./login.css";
import axios from "axios";

const Signup = () => {
  const [username, setusername] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [error, seterror] = useState("");
  const [password, setpassword] = useState("");
  const { signUp } = useUserAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const generatePassword = async () => {
    try {
      const response = await axios.get(
        "https://twiller-twitterclone-dz1k.onrender.com/api/generate-password"
      );
      setpassword(response.data.password);
      console.log(response.data.password);
    } catch (error) {
      console.error("Error generating password:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror("");
    try {
      await signUp(email, password);
      const user = {
        username: username,
        name: name,
        email: email,
      };
      fetch("https://twiller-twitterclone-dz1k.onrender.com/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.acknowledged) {
            console.log(data);
            navigate("/");
          }
        });
    } catch (error) {
      seterror(error.message);
      window.alert(error.message);
    }
  };
  const hanglegooglesignin = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="login-container">
        <div className="image-container">
          <img className="image" src={twitterimg} alt="twitterimage" />
        </div>

        <div className="form-container">
          <TwitterIcon className="Twittericon" style={{ color: "skyblue" }} />
          <h2 className="heading">Happening now</h2>
          <div class="d-flex align-items-sm-center">
            <h3 className="heading1"> Join twiller today</h3>
          </div>
          {error && <p className="errorMessage">{error}</p>}
          <form onSubmit={handlesubmit}>
            <input
              className="display-name"
              type="username"
              placeholder="@username"
              onChange={(e) => setusername(e.target.value)}
            />
            <input
              className="display-name"
              type="name"
              placeholder="Enter Full Name"
              onChange={(e) => setname(e.target.value)}
            />
            <input
              className="email"
              type="email"
              placeholder="Email Address"
              onChange={(e) => setemail(e.target.value)}
            />
            <div className="password-container">
              <input
                className="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
              <button className="show-div" type="button" onClick={togglePasswordVisibility}>
                <img className="show" src="https://cdn-icons-png.flaticon.com/128/2767/2767194.png" />
              </button>
            </div>
              <button className="btn" type="button" onClick={generatePassword}>
                Generate Password
              </button>
            <div className="btn-login">
              <button type="submit" className="btn">
                Sign Up
              </button>
            </div>
          </form>
          <hr />
          <div className="google-button">
            <GoogleButton
              className="g-btn"
              type="light"
              onClick={hanglegooglesignin}
            />
          </div>
          <div className="forgot-password">
            Already have an account?
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "var(--twitter-color)",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
