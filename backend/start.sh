#!/bin/bash

# Check if yarn is installed, install it if not
if ! command -v yarn &> /dev/null; then
    npm install -g yarn
fi

# Check if pm2 is installed, install it if not
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Install dependencies
yarn install

node deploy-commands.js

# Stop and delete existing PM2 process if it exists
pm2 stop discord-bot 2>/dev/null || true
pm2 delete discord-bot 2>/dev/null || true

# Start the server
pm2 start yarn --name "discord-bot" -- dev
