# MathbookLM Excalidraw fork

This directory is a git clone of upstream [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw) with MathbookLM-specific changes on branch `dev`.

## Remotes

| Remote | URL | Purpose |
|--------|-----|---------|
| `upstream` | `https://github.com/excalidraw/excalidraw.git` | Upstream releases |
| `origin` | `https://github.com/TomCohenDev/mathbooklm-excalidraw.git` | MathbookLM fork |

## Branches on `origin` (only these two)

| Branch | Contents | Use |
|--------|----------|-----|
| **`dev`** | Full Excalidraw monorepo (default for editing) | Day-to-day fork work; merge upstream here |
| **`main`** | `packages/excalidraw` subtree with committed `dist/` | Consumed via `github:TomCohenDev/mathbooklm-excalidraw#main`; updated with `make excalidraw-publish` |

Work locally on **`dev`**. Do not commit directly to **`main`** — it is produced by subtree split from `dev`.

## Build & publish

From the mathbooklm repo root:

```bash
make excalidraw          # rebuild dist/ + types in packages/excalidraw
make excalidraw-publish  # push subtree to origin/main (after commit)
```

## Committed dist

`packages/excalidraw/dist/` is tracked in git (see root `.gitignore` exceptions). The `prepare` script in `packages/excalidraw/package.json` exits immediately when `dist/prod/index.js` exists so tarball installs do not rebuild.
