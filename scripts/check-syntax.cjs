const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const { spawnSync } = require("node:child_process");

const roots = ["js", "tests", "scripts"];
function javascriptFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) return javascriptFiles(file);
    return entry.isFile() && /\.(?:js|cjs)$/.test(entry.name) ? [file] : [];
  });
}

const files = [...roots.flatMap(javascriptFiles), "playwright.config.cjs"];

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
  if (result.status !== 0) process.exitCode = result.status || 1;
}

if (!process.exitCode) console.log(`Syntax check passed for ${files.length} JavaScript files.`);
