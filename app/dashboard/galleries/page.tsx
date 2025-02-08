import AddFolderToGalleryForm from "@/components/AddFolderToGalleryForm";
import CreateFolderForm from "../../../components/CreateFolderForm";

export default function GalleryPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Folder to Gallery</h1>
      {/* <AddFolderToGalleryForm /> */}
      <CreateFolderForm />
    </div>
  );
}

// // Server Component

// import CreateGalleryForm from "./component/CreateGalleryForm";

// export default async function CreateGalleryPage() {
//   // Fetch or compute server-side data
//   const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "nadish"; // Default folder
//   const ownerId = "OWNER_ID_HERE"; // Replace with actual owner ID (e.g., from session)

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Create New Gallery</h1>
//       {/* Pass server-side data to the client component */}
//       <CreateGalleryForm
//         cloudinaryFolder={cloudinaryFolder}
//         ownerId={ownerId}
//       />
//     </div>
//   );
// }
