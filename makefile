.PHONY: staging prod

# staging: merges develop → staging and pushes
staging:
	@echo "Syncing 'staging' with 'develop'..."
	@git checkout staging
	@git merge develop
	@git push origin staging
	@git checkout develop
	@echo "'staging' is now up-to-date with 'develop' and pushed."

# prod: publish packages/excalidraw subtree from staging → origin/main.
# origin/main is the npm tarball branch (not the full monorepo) — see MATHBOOKLM.md.
prod:
	@echo "Releasing 'staging' into 'main' (production)..."
	@git checkout staging
	@git add packages/excalidraw/dist
	@git subtree split --prefix=packages/excalidraw -b pkg-publish
	@git push origin pkg-publish:main --force-with-lease
	@git checkout develop
	@echo "'main' subtree is published from 'staging'."
