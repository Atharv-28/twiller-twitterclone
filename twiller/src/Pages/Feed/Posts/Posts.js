import React, { useState } from "react";
import "./Posts.css";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";
import useLoggedinuser from "../../../hooks/useLoggedinuser";
import CustomVideoPlayer from "./VideoPlayer/CustomVideoPlayer";

const Posts = ({ p, isCurrentPost, onTripleTapLeft, onTripleTapMiddle, onTripleTapRight }) => {
  const { _id, name, username, post, profilephoto, media } = p;
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useUserAuth();
  const [loggedinsuer] = useLoggedinuser();
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
    <div className={`post ${isCurrentPost ? "current-post" : ""}`}>
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
              <CustomVideoPlayer
                src={media}
                onTripleTapLeft={() => onTripleTapLeft(toggleComments)}
                onTripleTapMiddle={() => onTripleTapMiddle()}
                onTripleTapRight={onTripleTapRight}
              />
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
                <Avatar sx={{ width: 24, height: 24 }} src={comment.commenterProfilePic} className="comment__avatar" />
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