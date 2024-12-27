import React, { useRef, useState, useEffect } from "react";
import "./Posts.css";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext"; // Import useUserAuth
import useLoggedinuser from "../../../hooks/useLoggedinuser"; // Import useLoggedinuser

const CustomVideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    if (tapCount === 1) {
      const singleTapTimeout = setTimeout(() => {
        const rect = videoRef.current.getBoundingClientRect();
        const x = videoRef.current.lastTapX;

        if (x > rect.width / 3 && x < (2 * rect.width) / 3) {
          // Single tap in the middle third
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }
        setTapCount(0);
      }, 300);

      return () => clearTimeout(singleTapTimeout);
    } else if (tapCount === 2) {
      const rect = videoRef.current.getBoundingClientRect();
      const x = videoRef.current.lastTapX;

      if (x < rect.width / 3) {
        // Double tap on the left side
        videoRef.current.currentTime -= 10;
      } else if (x > (2 * rect.width) / 3) {
        // Double tap on the right side
        videoRef.current.currentTime += 10;
      }
      setTapCount(0);
    } else if (tapCount === 3) {
      const rect = videoRef.current.getBoundingClientRect();
      const x = videoRef.current.lastTapX;

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
      setTapCount(0);
    }
  }, [tapCount]);

  const handleTap = (e) => {
    e.preventDefault();
    const rect = videoRef.current.getBoundingClientRect();
    const x = e.type === "click" ? e.clientX - rect.left : e.changedTouches[0].clientX - rect.left;
    videoRef.current.lastTapX = x;
    setTapCount((prev) => prev + 1);
  };

  return (
    <video
      ref={videoRef}
      width="500"
      controls
      onClick={handleTap}
      onTouchEnd={handleTap}
      onDoubleClick={(e) => e.preventDefault()}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

const Posts = ({ p }) => {
  const { _id, name, username, post, profilephoto, media } = p;
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useUserAuth(); // Use useUserAuth
  const [loggedinsuer] = useLoggedinuser(); // Use useLoggedinuser
  const commenterName = loggedinsuer[0]?.name || user?.displayName;
  const commenterProfilePic = loggedinsuer[0]?.profileImage || user?.photoURL;

  const toggleComments = async () => {
    setShowComments(!showComments);
    if (!showComments) {
      const res = await axios.get(`http://localhost:5000/comments?postId=${_id}`);
      setComments(res.data);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const commentData = {
      postId: _id,
      comment: newComment,
      commenterName,
      commenterProfilePic,
    };
    await axios.post("http://localhost:5000/comments", commentData);
    setNewComment("");
    const res = await axios.get(`http://localhost:5000/comments?postId=${_id}`);
    setComments(res.data);
  };

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
            className="post__footer__icon"
            fontSize="small"
            onClick={toggleComments}
          />
          <RepeatIcon className="post__footer__icon" fontSize="small" />
          <FavoriteBorderIcon className="post__footer__icon" fontSize="small" />
          <PublishIcon className="post__footer__icon" fontSize="small" />
        </div>
        {showComments && (
          <div className="comments-section">
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                <Avatar sx={{width:24,height:24}} src={comment.commenterProfilePic} className="comment__avatar" />
                <div className="comment__content">
                  <span className="comment__name">{comment.commenterName}</span>
                  <span>{comment.comment}</span>
                </div>
              </div>
            ))}
            <form className="comment-form" onSubmit={handleAddComment}>
              <input
                type="text"
                placeholder="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <button type="submit">Comment</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;