// app/dashboard/upload/component/CustomVideoPlayer.tsx
import { useState } from "react";
import ReactPlayer from "react-player";

function CustomVideoPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative">
      <ReactPlayer
        url={url}
        playing={playing}
        controls={false} // Disable default controls
        width="100%"
        height="100%"
        onError={() => console.error(`Failed to load video.`)}
      />
      <button
        onClick={() => setPlaying(!playing)}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md"
      >
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}

export default CustomVideoPlayer;
