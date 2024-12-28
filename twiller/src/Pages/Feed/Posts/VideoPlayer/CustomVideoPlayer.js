import React, { useRef } from "react";

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

  export default CustomVideoPlayer;