import React, { useState } from "react";
import "./Tweetbox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";
import useLoggedinuser from "../../../hooks/useLoggedinuser";

const Tweetbox = () => {
  const [post, setpost] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [isloading, setisloading] = useState(false);
  const [name, setname] = useState("");
  const [username, setusername] = useState("");
  const { user } = useUserAuth();
  const [loggedinsuer] = useLoggedinuser();
  const email = user?.email;
  const userprofilepic = loggedinsuer[0]?.profileImage
    ? loggedinsuer[0].profileImage
    : user && user.photoURL;

  const handleUploadMedia = async (e) => {
    setisloading(true);
    const media = e.target.files[0];
    const formData = new FormData();
    formData.append("file", media);
    formData.append("upload_preset", "ck4cetvf"); // Replace with your Cloudinary upload preset

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dhnplptdz/upload", 
        formData
      );
      setMediaUrl(res.data.secure_url);
      console.log(mediaUrl);
      console.log(res.data.secure_url);
      setisloading(false);
    } catch (error) {
      console.error("Error uploading media:", error);
      setisloading(false);
    }
  };

  const handletweet = (e) => {
    e.preventDefault();
    if (user?.providerData[0]?.providerId === "password") {
      fetch(`http://localhost:5000/loggedinuser?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          setname(data[0]?.name);
          setusername(data[0]?.username);
        });
    } else {
      setname(user?.displayName);
      setusername(email?.split("@")[0]);
    }
    if (name) {
      const userpost = {
        profilephoto: userprofilepic,
        post: post,
        media: mediaUrl,
        username: username,
        name: name,
        email: email,
      };
      setpost("");
      setMediaUrl("");
      fetch("http://localhost:5000/post", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userpost),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }
  };

  return (
    <div className="tweetBox">
      <form onSubmit={handletweet}>
        <div className="tweetBox__input">
          <Avatar
            src={
              loggedinsuer[0]?.profileImage
                ? loggedinsuer[0].profileImage
                : user && user.photoURL
            }
          />
          <input
            type="text"
            placeholder="What's happening?"
            onChange={(e) => setpost(e.target.value)}
            value={post}
            required
          />
        </div>
        <div className="imageIcon_tweetButton">
          <label htmlFor="media" className="imageIcon">
            {isloading ? (
              <p>Uploading Media</p>
            ) : (
              <p>
                {mediaUrl ? "Media Uploaded" : <AddPhotoAlternateOutlinedIcon />}
              </p>
            )}
          </label>
          <input
            type="file"
            id="media"
            className="imageInput"
            accept="image/*,video/*"
            onChange={handleUploadMedia}
          />
          <Button className="tweetBox__tweetButton" type="submit">
            Tweet
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Tweetbox;