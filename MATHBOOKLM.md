# MathbookLM Excalidraw fork

This directory is a git clone of upstream [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw) with MathbookLM-specific changes on branch `mathbooklm`.

## Remotes

| Remote | URL | Purpose |
|--------|-----|---------|
| `upstream` | `https://github.com/excalidraw/excalidraw.git` | Upstream releases |
| `origin` | `https://github.com/TomCohenDev/mathbooklm-excalidraw.git` | MathbookLM fork |

## Branches on `origin`

- **`main`** — publishable `@excalidraw/excalidraw` package (subtree of `packages/excalidraw`, including committed `dist/`). Consumed by `mathbooklm-website` via `github:TomCohenDev/mathbooklm-excalidraw#main`.
- **`monorepo`** — full fork tree for development and upstream merges.

## Build & publish

From the mathbooklm repo root:

```bash
make excalidraw          # rebuild dist/ + types in packages/excalidraw
make excalidraw-publish  # push subtree to origin/main (after commit)
```

## Committed dist

`packages/excalidraw/dist/` is tracked in git (see root `.gitignore` exceptions). The `prepare` script in `packages/excalidraw/package.json` exits immediately when `dist/prod/index.js` exists so tarball installs do not rebuild.
