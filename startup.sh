#!/bin/bash

# Initialize conda for bash
eval "$(conda shell.bash hook)"

#use conda
conda activate discord_utilities_bot

# Install requirements
pip install -r requirements.txt

# Start the Update Listener in the background
nohup python Update_Listener.py

# Print success message
echo "Update Listener started successfully in background"
