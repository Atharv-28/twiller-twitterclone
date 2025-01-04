import React, { useRef } from "react";
import "../Posts.css";

const CustomVideoPlayer = ({
  src,
  onTripleTapLeft,
  onTripleTapMiddle,
  onTripleTapRight,
}) => {
  const videoRef = useRef(null);
  const tapTimeoutRef = useRef(null);
  const tapCountRef = useRef(0);

  const handleTap = (e) => {
    e.preventDefault(); // Prevent default action for double-tap

    tapCountRef.current++;
    clearTimeout(tapTimeoutRef.current);

    tapTimeoutRef.current = setTimeout(() => {
      const rect = videoRef.current.getBoundingClientRect();
      let x;
      if (e.type === "click") {
        x = e.clientX - rect.left;
      } else if (e.type === "touchend") {
        x = e.changedTouches[0].clientX - rect.left;
      }
      if (tapCountRef.current === 1) {
        if (x > rect.width / 3 && x < (2 * rect.width) / 3) {
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }
      } else if (tapCountRef.current === 2) {
        if (x < rect.width / 3) {
          videoRef.current.currentTime -= 10;
        } else if (x > (2 * rect.width) / 3) {
          videoRef.current.currentTime += 10;
        }
      } else if (tapCountRef.current === 3) {
        if (x < rect.width / 3) {
          onTripleTapLeft();
        } else if (x > (2 * rect.width) / 3) {
          onTripleTapRight();
        } else {
          onTripleTapMiddle();
        }
      }

      tapCountRef.current = 0; // Reset tap count
    }, 300);
  };

  return (
    <video
      className="post_Media"
      ref={videoRef}
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

export default CustomVideoPlayer;
