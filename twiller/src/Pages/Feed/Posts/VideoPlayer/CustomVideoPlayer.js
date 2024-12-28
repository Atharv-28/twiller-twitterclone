import React, { useRef } from "react";

const CustomVideoPlayer = ({ src }) => {
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

      console.log(`Tap count: ${tapCountRef.current}`);

      if (tapCountRef.current === 1) {
        // Single tap
        if (x > rect.width / 3 && x < (2 * rect.width) / 3) {
          // Single tap in the middle third
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }
      } else if (tapCountRef.current === 2) {
        // Double tap
        if (x < rect.width / 3) {
          // Double tap on the left side
          videoRef.current.currentTime -= 10;
        } else if (x > (2 * rect.width) / 3) {
          // Double tap on the right side
          videoRef.current.currentTime += 10;
        }
      } else if (tapCountRef.current === 3) {
        // Triple tap
        if (x < rect.width / 3) {
          // Triple tap on the left side
          console.log("Triple tap on the left side");
        } else if (x > (2 * rect.width) / 3) {
          // Triple tap on the right side
          alert("Triple tap on the right side");
        } else {
          // Triple tap in the middle
          alert("Triple tap in the middle");
        }
      }

      tapCountRef.current = 0; // Reset tap count
    }, 300); // Adjust the timeout duration as needed
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
