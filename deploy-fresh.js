#!/usr/bin/env node

/**
 * Fresh deployment script for GitHub Pages
 * This script ensures a clean build and deployment to prevent cache issues
 */

import { execSync } from "child_process";
import fs from "fs";
import process from "process";

console.log("🧹 Starting fresh deployment...");

try {
  // Clean previous build
  console.log("Cleaning previous build...");
  if (fs.existsSync("dist")) {
    fs.rmSync("dist", { recursive: true, force: true });
  }

  // Clean npm cache
  console.log("Cleaning build cache...");
  execSync("npm run clean", { stdio: "inherit" });

  // Fresh build
  console.log("🔨 Building project...");
  execSync("npm run build", { stdio: "inherit" });

  // Verify build
  if (!fs.existsSync("dist/index.html")) {
    throw new Error("Build failed - index.html not found in dist folder");
  }

  // Deploy with force (no history)
  console.log("🚀 Deploying to GitHub Pages...");
  execSync("npm run deploy-force", { stdio: "inherit" });

  console.log("✅ Deployment completed successfully!");
  console.log("📝 Note: GitHub Pages may take 5-10 minutes to update");
  console.log("🌐 Your site: https://ronniegrg.github.io/portfolio/");
} catch (error) {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
}
