#!/usr/bin/env node

const { exec } = require("child_process");
const path = require("path");

console.log("Testing React portfolio application...");

// Test build process
console.log("\n🔨 Testing build process...");
exec("npm run build", { cwd: __dirname }, (error, stdout, stderr) => {
  if (error) {
    console.error("❌ Build failed:");
    console.error(error.message);
    return;
  }

  if (stderr) {
    console.warn("⚠️ Build warnings:");
    console.warn(stderr);
  }

  console.log("✅ Build completed successfully!");
  console.log(stdout);

  // Test lint
  console.log("\n🔍 Running linter...");
  exec(
    "npm run lint",
    { cwd: __dirname },
    (lintError, lintStdout, lintStderr) => {
      if (lintError) {
        console.warn("⚠️ Lint issues found:");
        console.warn(lintError.message);
      } else {
        console.log("✅ Linting passed!");
      }

      if (lintStdout) {
        console.log(lintStdout);
      }

      if (lintStderr) {
        console.log(lintStderr);
      }

      console.log("\n🎉 All tests completed!");
    }
  );
});
