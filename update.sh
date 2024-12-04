#!/bin/bash

# Print start message
echo "Starting update process..."

# Fetch the latest changes from remote
git fetch origin main

# Check if there are any changes
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "Already up to date!"
    exit 0
fi

# Stash any local changes
git stash

# Pull the latest changes
git pull origin main

# Apply stashed changes if any
git stash pop 2>/dev/null || true

echo "Update completed successfully!"
