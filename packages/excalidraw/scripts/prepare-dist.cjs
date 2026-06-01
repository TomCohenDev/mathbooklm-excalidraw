/**
 * prepare: tarball / git installs use committed dist/ (no rebuild).
 * Full monorepo clones without dist/ fall back to a local build.
 * Rebuilds when package source is newer than dist (linked fork dev workflow).
 * JS bundle and .d.ts declarations are both required for mathbooklm-website tsc.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const pkgRoot = path.join(__dirname, "..");
const devMarker = path.join(pkgRoot, "dist", "dev", "index.js");
const prodMarker = path.join(pkgRoot, "dist", "prod", "index.js");
const typesMarker = path.join(pkgRoot, "dist", "types", "excalidraw", "index.d.ts");

const monorepoRoot = path.join(pkgRoot, "..", "..");
const buildScript = path.join(monorepoRoot, "scripts", "buildPackage.js");
const tscCmd = "node ../../node_modules/typescript/bin/tsc -p tsconfig.json";

const SKIP_DIR_NAMES = new Set(["dist", "node_modules", ".git"]);

function newestSourceMtime(dir) {
  let max = 0;
  const walk = (current) => {
    for (const ent of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        if (SKIP_DIR_NAMES.has(ent.name)) {
          continue;
        }
        walk(full);
      } else if (ent.isFile() && /\.(tsx?|scss)$/.test(ent.name)) {
        max = Math.max(max, fs.statSync(full).mtimeMs);
      }
    }
  };
  walk(dir);
  return max;
}

function isDistStale(markerPath) {
  if (!fs.existsSync(markerPath)) {
    return true;
  }
  const distMtime = fs.statSync(markerPath).mtimeMs;
  return newestSourceMtime(pkgRoot) > distMtime;
}

function runTsc() {
  execSync(tscCmd, { cwd: pkgRoot, stdio: "inherit" });
}

function runBuild() {
  console.log("@excalidraw/excalidraw: rebuilding dist/ from monorepo sources...");
  // buildPackage.js entry points (index.tsx, *.chunk.ts) are relative to this package root.
  execSync(`node "${buildScript}"`, { cwd: pkgRoot, stdio: "inherit" });
}

if (!fs.existsSync(buildScript)) {
  if (fs.existsSync(prodMarker) && fs.existsSync(typesMarker)) {
    process.exit(0);
  }
  console.error(
    "@excalidraw/excalidraw: dist/ is missing. Install from TomCohenDev/mathbooklm-excalidraw (committed dist) or build from the mathbooklm excalidraw monorepo.",
  );
  process.exit(1);
}

const bundleStale = isDistStale(devMarker);
const typesMissing = !fs.existsSync(typesMarker);

if (
  fs.existsSync(prodMarker) &&
  fs.existsSync(devMarker) &&
  fs.existsSync(typesMarker) &&
  !bundleStale
) {
  process.exit(0);
}

if (!fs.existsSync(prodMarker) || bundleStale) {
  runBuild();
}

if (typesMissing || bundleStale) {
  console.log("@excalidraw/excalidraw: generating TypeScript declarations...");
  runTsc();
}
