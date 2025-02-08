// lib/cloudinaryTypes.ts
export interface CloudinaryFolder {
  name: string; // Name of the folder
  path: string; // Path to the folder
}

export interface CloudinarySubFoldersResponse {
  folders: CloudinaryFolder[]; // Array of folders
}
