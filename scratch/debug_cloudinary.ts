import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import cloudinary from "../src/lib/cloudinary";

async function debugFolders() {
  try {
    console.log("--- Checking Website/Services ---");
    const root = await cloudinary.api.sub_folders("Website/Services");
    console.log("Subfolders of Website/Services:", root.folders.map(f => f.name));
    
    console.log("\n--- Checking Home/Website/Services ---");
    const home = await cloudinary.api.sub_folders("Home/Website/Services");
    console.log("Subfolders of Home/Website/Services:", home.folders.map(f => f.name));
    
    for (const folder of home.folders) {
      const resources = await cloudinary.api.resources_by_asset_folder(folder.path);
      console.log(`\nFolder: ${folder.path} (${folder.name})`);
      console.log(`Resources found: ${resources.resources.length}`);
      if (resources.resources.length > 0) {
        console.log(`First resource: ${resources.resources[0].secure_url}`);
      }
    }
  } catch (error) {
    console.error("Debug Error:", error);
  }
}

debugFolders();
