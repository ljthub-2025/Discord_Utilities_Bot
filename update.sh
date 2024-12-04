#!/bin/bash
git fetch
git stash --include-untracked
git pull
git stash pop || true
pip install -r requirements.txt
# Start the Update Listener in the background
nohup python Update_Listener.py > Update_Listener.log 2>&1 &

# Print success message
echo "Update Listener started successfully in background"