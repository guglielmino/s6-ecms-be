#!/bin/bash

# Setting for using custom path for git hooks (shared with other users)
git config core.hooksPath ./scripts/git-hooks/
# Git-flow settings
git flow init -df
git config gitflow.prefix.versiontag v_
git config gitflow.path.hooks ./scripts/git-hooks/
