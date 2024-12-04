#!/bin/bash

# Stop the PM2 process for discord-bot
pm2 stop discord-bot 2>/dev/null || true

# Delete the PM2 process for discord-bot
pm2 delete discord-bot 2>/dev/null || true