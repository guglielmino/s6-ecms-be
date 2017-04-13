#!/bin/bash

# Setting for using custom path for git hooks (shared with other users)
git config core.hooksPath ./scripts/git-hooks/
# Git-flow settings
git flow init -d
git config gitflow.prefix.versiontag v_
git config gitflow.path.hooks ./git_hooks/git-flow-hooks