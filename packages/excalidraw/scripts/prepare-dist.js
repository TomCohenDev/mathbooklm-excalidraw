/**
 * prepare: tarball / git installs use committed dist/ (no rebuild).
 * Full monorepo clones without dist/ fall back to a local build.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const pkgRoot = path.join(__dirname, "..");
const distMarker = path.join(pkgRoot, "dist", "prod", "index.js");

if (fs.existsSync(distMarker)) {
  process.exit(0);
}

const monorepoRoot = path.join(pkgRoot, "..", "..");
const buildScript = path.join(monorepoRoot, "scripts", "buildPackage.js");

if (!fs.existsSync(buildScript)) {
  console.error(
    "@excalidraw/excalidraw: dist/ is missing. Install from TomCohenDev/mathbooklm-excalidraw (committed dist) or build from the mathbooklm excalidraw monorepo.",
  );
  process.exit(1);
}

console.log("@excalidraw/excalidraw: dist/ missing — building from monorepo...");
execSync(`node "${buildScript}"`, { cwd: monorepoRoot, stdio: "inherit" });
execSync("node ../../node_modules/typescript/bin/tsc -p tsconfig.json", {
  cwd: pkgRoot,
  stdio: "inherit",
});
