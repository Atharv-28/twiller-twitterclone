import React, { useRef } from "react";
import "./Posts.css";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";

const CustomVideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  let tapTimeout = null;
  let tapCount = 0;

  const handleTap = (e) => {
    e.preventDefault(); // Prevent default action for double-tap
    tapCount++;
    clearTimeout(tapTimeout);
    tapTimeout = setTimeout(() => {
      const rect = videoRef.current.getBoundingClientRect();
      let x;
      if (e.type === "click") {
        x = e.clientX - rect.left;
      } else if (e.type === "touchend") {
        x = e.changedTouches[0].clientX - rect.left;
      }

      if (tapCount === 1) {
        // Single tap
        if (e.target === videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }
      } else if (tapCount === 2) {
        // Double tap
        if (x < rect.width / 3) {
          // Double tap on the left side
          videoRef.current.currentTime -= 10;
        } else if (x > (2 * rect.width) / 3) {
          // Double tap on the right side
          videoRef.current.currentTime += 10;
        }
      } else if (tapCount === 3) {
        // Triple tap
        if (x < rect.width / 3) {
          // Triple tap on the left side
          alert("Show comment section");
        } else if (x > (2 * rect.width) / 3) {
          // Triple tap on the right side
          window.close();
        } else {
          // Triple tap in the middle
          alert("Move to next video");
        }
      }
      tapCount = 0;
    }, 300);
  };

  return (
    <video
      ref={videoRef}
      width="500"
      controls
      onClick={handleTap}
      onTouchEnd={handleTap}
      onDoubleClick={(e) => e.preventDefault()} // Prevent default double-click behavior
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

const Posts = ({ p }) => {
  const { name, username, post, profilephoto, media } = p;
  return (
    <div className="post">
      <div className="post__avatar">
        <Avatar src={profilephoto} />
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {name}{" "}
              <span className="post__headerSpecial">
                <VerifiedUserIcon className="post__badge" /> @{username}
              </span>
            </h3>
          </div>
          <div className="post__headerDescription">
            <p>{post}</p>
          </div>
        </div>
        {media && (
          <div className="post__media">
            {media.endsWith(".mp4") || media.endsWith(".webm") ? (
              <CustomVideoPlayer src={media} />
            ) : (
              <img src={media} alt="" width="500" />
            )}
          </div>
        )}
        <div className="post__footer">
          <ChatBubbleOutlineIcon
            className="post__fotter__icon"
            fontSize="small"
          />
          <RepeatIcon className="post__fotter__icon" fontSize="small" />
          <FavoriteBorderIcon className="post__fotter__icon" fontSize="small" />
          <PublishIcon className="post__fotter__icon" fontSize="small" />
        </div>
      </div>
    </div>
  );
};

export default Posts;