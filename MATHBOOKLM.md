# MathbookLM Excalidraw fork

GitHub: **https://github.com/TomCohenDev/mathbooklm-excalidraw**

This directory is a git clone of upstream [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw) with MathbookLM-specific changes on branch `develop` (same working-branch name as `mathbooklm-server` and `mathbooklm-website`).

## Remotes

| Remote | URL | Purpose |
|--------|-----|---------|
| `upstream` | `https://github.com/excalidraw/excalidraw.git` | Upstream releases |
| `origin` | `https://github.com/TomCohenDev/mathbooklm-excalidraw.git` | MathbookLM fork |

## Branches on `origin`

| Branch | Contents | Use |
|--------|----------|-----|
| **`develop`** | Full Excalidraw monorepo (default) | Day-to-day fork work; merge upstream here |
| **`staging`** | Full monorepo pre-release | Promoted from `develop` via `make staging` |
| **`main`** | `packages/excalidraw` subtree with committed `dist/` | Consumed via `github:TomCohenDev/mathbooklm-excalidraw#main`; updated with `make prod` |

Work locally on **`develop`**. Do not commit directly to **`main`** — it is produced by subtree split from `staging`.

## Build & publish

From the mathbooklm repo root:

```bash
make excalidraw          # rebuild dist/ + types in packages/excalidraw
```

Branch promotion (same `develop` → `staging` → `main` flow as `mathbooklm-server` / `mathbooklm-website`), run from this directory (`excalidraw/`):

```bash
make staging   # merge develop → staging, push to origin, return to develop
make prod      # subtree-publish packages/excalidraw → origin/main on TomCohenDev/mathbooklm-excalidraw
```

Commit built `dist/` on `develop` before `make staging`.

## Committed dist

`packages/excalidraw/dist/` is tracked in git (see root `.gitignore` exceptions). The `prepare` script in `packages/excalidraw/package.json` exits immediately when `dist/prod/index.js` exists so tarball installs do not rebuild.
