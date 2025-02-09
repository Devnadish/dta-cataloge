// app/dashboard/upload/page.tsx (Server Component)
import axiosInstance from "../../../lib/axiosInstance";
import GalleryUploadForm from "./component/GalleryUploadForm"; // Import the client component

export default async function UploadPage() {
  // Fetch galleries on the server side using Axios
  const galleries = await fetchGalleries();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Media Album</h1>

      {/* Pass galleries as props to the client component */}
      <GalleryUploadForm galleries={galleries} />
    </div>
  );
}

// Function to fetch galleries from the API using Axios
async function fetchGalleries() {
  try {
    const response = await axiosInstance.get("/galleries"); // Use Axios to fetch galleries
    return response.data; // Return the parsed JSON data
  } catch (error) {
    console.error("Failed to fetch galleries:", error);
    throw new Error("Failed to fetch galleries");
  }
}
