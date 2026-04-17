import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { v2 as cloudinary } from "cloudinary";
import { getServerConfig } from "../src/lib/config";

// Manual config for debug
const config = getServerConfig();
console.log("Config loaded:", {
  cloud: config.cloudinaryCloudName,
  key: config.cloudinaryApiKey ? "PRESENT" : "MISSING",
});

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: true,
});

async function debugFolders() {
  try {
    // Try both with and without Home/
    const pathsToTry = [
      "Website/Services/Outdoor Spaces", 
      "Website/Services/Ecosystem Ponds and Waterfalls", 
      "Website/Services/Pondless Waterfalls and Fountainscapes", 
      "Website/Services/Landscapes and Lighting"
    ];
    
    for (const p of pathsToTry) {
      console.log(`\n--- Checking path: "${p}" ---`);
      try {
        const result = await cloudinary.api.sub_folders(p);
        console.log(`Subfolders of "${p}":`, result.folders.map(f => f.name));
        
        for (const folder of result.folders) {
          const res = await cloudinary.api.resources_by_asset_folder(folder.path);
          console.log(`  Folder: ${folder.path} | Resources: ${res.resources.length}`);
          if (res.resources.length > 0) {
            console.log(`    URL: ${res.resources[0].secure_url}`);
          }
        }
      } catch (e) {
        console.log(`Error for path "${p}":`, e.message);
      }
    }
  } catch (error) {
    console.error("General Debug Error:", error);
  }
}

debugFolders();
