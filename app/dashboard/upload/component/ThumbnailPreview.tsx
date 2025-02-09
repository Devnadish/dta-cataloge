// app/dashboard/upload/component/ThumbnailPreview.tsx
import { useState } from "react";
import { useInView } from "react-intersection-observer"; // For lazy loading
import Image from "next/image"; // Import Next.js Image component
import ReactPlayer from "react-player"; // Import ReactPlayer for video previews
import { toast } from "sonner"; // For toast notifications
import { Trash2 } from "lucide-react"; // Import trash icon from Lucide

interface FileWithPreview extends File {
  preview?: string; // Add the `preview` property
}

function ThumbnailPreview({
  file,
  onRemove,
}: {
  file: FileWithPreview;
  onRemove: () => void;
}) {
  const isVideo = file.type.startsWith("video/");
  const { ref, inView } = useInView({
    triggerOnce: true, // Load the media only once when it enters the viewport
    threshold: 0.1, // Trigger when 10% of the element is visible
  });

  return (
    <div className="relative border rounded-lg overflow-hidden h-48" ref={ref}>
      {isVideo ? (
        inView ? (
          <ReactPlayer
            key={file.preview} // Forces reinitialization when the file changes
            url={file.preview}
            controls={true} // Use default controls or customize them
            width="100%"
            height="100%"
            onError={() => {
              console.error(`Failed to load video: ${file.name}`);
              toast.error(`Failed to load video: ${file.name}`);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            Loading video...
          </div>
        )
      ) : (
        <Image
          src={file.preview || "/placeholder.png"}
          alt={file.name}
          fill // Ensures the image fills the container
          className="object-cover" // Ensures proper scaling
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png"; // Fallback image
            toast.error(`Failed to load image: ${file.name}`);
          }}
        />
      )}

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
      >
        <Trash2 size={16} /> {/* Trash icon */}
      </button>
    </div>
  );
}

export default ThumbnailPreview;

// // app/dashboard/upload/component/ThumbnailPreview.tsx
// import { useState, useEffect } from "react";
// import { useInView } from "react-intersection-observer"; // For lazy loading
// import Image from "next/image"; // Import Next.js Image component
// import ReactPlayer from "react-player"; // Import ReactPlayer for video/audio previews
// import { toast } from "sonner"; // For toast notifications
// import { Music } from "lucide-react"; // Import Lucide icons

// interface FileWithPreview extends File {
//   preview?: string; // Add the `preview` property
// }

// function ThumbnailPreview({
//   file,
//   onRemove,
// }: {
//   file: FileWithPreview;
//   onRemove: () => void;
// }) {
//   const isVideo = file.type.startsWith("video/");
//   const isAudio = file.type.startsWith("audio/");
//   const { ref, inView } = useInView({
//     triggerOnce: true, // Load the media only once when it enters the viewport
//     threshold: 0.1, // Trigger when 10% of the element is visible
//   });

//   return (
//     <div className="relative border rounded-lg overflow-hidden" ref={ref}>
//       {isVideo ? (
//         inView ? (
//           <ReactPlayer
//             key={file.preview} // Forces reinitialization when the file changes
//             url={file.preview}
//             controls={true} // Use default controls or customize them
//             width="100%"
//             height="100%"
//             onError={() => {
//               console.error(`Failed to load video: ${file.name}`);
//               toast.error(`Failed to load video: ${file.name}`);
//             }}
//           />
//         ) : (
//           <div className="flex items-center justify-center h-32 bg-gray-200">
//             Loading video...
//           </div>
//         )
//       ) : isAudio ? (
//         <div className="flex flex-col items-center justify-center h-32 bg-gray-200">
//           <Music size={24} /> {/* Use a music icon */}
//           <p className="text-sm text-gray-700">{file.name}</p>{" "}
//           {/* Display the file name */}
//         </div>
//       ) : (
//         <img
//           src={file.preview || "/placeholder.png"}
//           alt={file.name}
//           className="w-full h-32 object-cover"
//           onError={(e) => {
//             e.currentTarget.src = "/placeholder.png"; // Fallback image
//             toast.error(`Failed to load image: ${file.name}`);
//           }}
//         />
//       )}

//       {/* Remove Button */}
//       <button
//         onClick={onRemove}
//         className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
//       >
//         Remove
//       </button>
//     </div>
//   );
// }

// export default ThumbnailPreview;
