#!/bin/bash

# Check if yarn is installed, install it if not
if ! command -v yarn &> /dev/null; then
    npm install -g yarn
fi

# Install dependencies
yarn install

# Start the server
yarn start
