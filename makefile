.PHONY: staging prod ensure-staging

# ensure-staging: checkout staging, creating it from develop on first run.
ensure-staging:
	powershell -NoProfile -ExecutionPolicy Bypass -File scripts/ensure-staging.ps1

# staging: merges develop → staging and pushes (full monorepo pre-release).
staging: ensure-staging
	@echo "Syncing 'staging' with 'develop'..."
	@git merge develop
	@git push origin staging
	@git checkout develop
	@echo "'staging' is now up-to-date with 'develop' and pushed."

# prod: publish packages/excalidraw from staging to origin/main.
# Unlike server/website, origin/main is the subtree package branch consumed by
# mathbooklm-website (github:TomCohenDev/mathbooklm-excalidraw#main), not the
# full monorepo — see MATHBOOKLM.md. Run `make excalidraw` at the monorepo root
# first so packages/excalidraw/dist is built and committed on develop/staging.
prod: ensure-staging
	@echo "Publishing 'staging' to origin/main (packages/excalidraw subtree)..."
	@git pull origin staging
	@git add packages/excalidraw/dist
	@git subtree split --prefix=packages/excalidraw -b pkg-publish
	@git push origin pkg-publish:main --force-with-lease
	@git checkout develop
	@echo "'main' subtree is published from 'staging'."
