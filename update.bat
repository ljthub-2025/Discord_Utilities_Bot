@echo off
git fetch
git stash --include-untracked
git pull
git stash pop || true
pip install -r requirements.txt
