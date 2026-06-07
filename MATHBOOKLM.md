# MathbookLM Excalidraw fork

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
| **`main`** | `packages/excalidraw` subtree with committed `dist/` | Consumed via `github:TomCohenDev/mathbooklm-excalidraw#main`; updated with `make excalidraw-publish` |

Work locally on **`develop`**. Do not commit directly to **`main`** — it is produced by subtree split from `develop`.

## Build & publish

From the mathbooklm repo root:

```bash
make excalidraw          # rebuild dist/ + types in packages/excalidraw
make excalidraw-publish  # push subtree to origin/main (after commit)
```

Branch promotion (same `develop` → `staging` → prod flow as `mathbooklm-server` / `mathbooklm-website`), run from this directory:

```bash
make staging   # merge develop → staging, push, return to develop
make prod      # subtree-publish packages/excalidraw from staging → origin/main
```

Commit built `dist/` on `develop` before `make staging`. `make prod` is equivalent to `make excalidraw-publish` at the monorepo root, but runs from `staging` instead of whatever branch is checked out.

## Committed dist

`packages/excalidraw/dist/` is tracked in git (see root `.gitignore` exceptions). The `prepare` script in `packages/excalidraw/package.json` exits immediately when `dist/prod/index.js` exists so tarball installs do not rebuild.
