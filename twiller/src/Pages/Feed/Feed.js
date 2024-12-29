import React, { useEffect, useState } from "react";
import "./Feed.css";
import Posts from "./Posts/Posts";
import Tweetbox from "./Tweetbox/Tweetbox";
import axios from "axios";

const Feed = () => {
  const [post, setpost] = useState([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/post")
      .then((res) => res.json())
      .then((data) => {
        setpost(data);
      });
  }, []);

  const handleTripleTapMiddle = () => {
    let nextPostIndex = currentPostIndex + 1;
    while (
      nextPostIndex < post.length &&
      !(post[nextPostIndex].media.endsWith(".mp4") || post[nextPostIndex].media.endsWith(".webm"))
    ) {
      nextPostIndex++;
    }
    if (nextPostIndex < post.length) {
      setCurrentPostIndex(nextPostIndex);
    } else {
      alert("No more video posts available");
    }
  };

  const handleTripleTapLeft = (toggleComments) => {
    toggleComments();
  };

  const handleTripleTapRight = () => {
    window.close();
  };

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>
      <Tweetbox />
      {post.map((p, index) => (
        <Posts
          key={p._id}
          p={p}
          isCurrentPost={index === currentPostIndex}
          onTripleTapLeft={handleTripleTapLeft}
          onTripleTapMiddle={handleTripleTapMiddle}
          onTripleTapRight={handleTripleTapRight}
        />
      ))}
    </div>
  );
};

export default Feed;