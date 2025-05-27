import fs from "fs";
import path from "path";

try {
  const file = path.resolve(
    "/d/Independant Projects/portfolio/public/manifest.webmanifest"
  );
  const content = fs.readFileSync(file, "utf8");
  JSON.parse(content);
  // JSON is valid
} catch (e) {
  console.error("Error:", e.message);
}
