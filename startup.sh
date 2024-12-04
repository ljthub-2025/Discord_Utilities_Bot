#!/bin/bash

# # Create and activate virtual environment if it doesn't exist
# if [ ! -d "venv" ]; then
#     python -m venv venv
# fi

# # Activate virtual environment
# source venv/bin/activate

#use conda
conda activate discord_utilities_bot

# Install requirements
pip install -r requirements.txt

# Start the Update Listener in the background
nohup python Update_Listener.py > Update_Listener.log 2>&1 &

# Print success message
echo "Update Listener started successfully in background"
