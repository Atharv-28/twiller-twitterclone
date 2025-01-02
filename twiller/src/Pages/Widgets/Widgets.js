import React, { useState } from "react";
import "./widget.css";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { TwitterTimelineEmbed, TwitterTweetEmbed } from "react-twitter-embed";

const Widgets = () => {
  const [isWidgetsOpen, setIsWidgetsOpen] = useState(false);

  const toggleWidgets = () => {
    setIsWidgetsOpen(!isWidgetsOpen);
  };

  return (
    <>
      <MenuIcon className="widgets__hamburgerIcon" onClick={toggleWidgets} />
      <div className={`widgets__hamburger ${isWidgetsOpen ? "open" : ""}`}>
        <div className="widgets__input">
          <SearchIcon className="widget__searchIcon" />
          <input placeholder="Search Twitter" type="text" />
        </div>
        <div className="widgets__widgetContainer">
          <h2>What's Happening</h2>
          <TwitterTweetEmbed tweetId={"1816174440071241866"} />
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="Valorant"
            options={{ height: 400 }}
          />
        </div>
      </div>
    </>
  );
};

export default Widgets;
