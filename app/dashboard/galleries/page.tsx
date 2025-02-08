import CreateGalleryForm from "./component/CreateGalleryForm";
import GalleryList from "./component/GalleryList";

async function fetchGalleries() {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/galleries`;
  console.log("Fetching galleries from URL:", url); // Log the URL being used
  try {
    const response = await fetch(url, {
      cache: "no-store",
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch galleries: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return [];
  }
}

export default async function GalleriesPage() {
  const galleries = await fetchGalleries();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Gallery Management</h1>

      {/* Create Gallery Form */}
      <CreateGalleryForm />

      {/* Gallery List */}
      <GalleryList galleries={galleries} />
    </div>
  );
}
