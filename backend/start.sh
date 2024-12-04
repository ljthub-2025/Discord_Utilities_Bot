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

# Start the server
pm2 start yarn --name "discord-bot" -- dev
