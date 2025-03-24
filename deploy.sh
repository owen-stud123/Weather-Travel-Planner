#!/bin/bash
#This script sets up your Flask app on both web servers.
# Update system and install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv

# Navigating to server directory
cd /home/ubuntu/weather-forecast-app/server

# Creating a virtual environment and activate it
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Export environment variables
export FLASK_APP=app.py
export FLASK_ENV=production
export X_RAPIDAPI_KEY="a419c4e183mshd579c3b0521e74cp192608jsndc0b5c923c55"

# Restart Flask app using Gunicorn
pkill gunicorn
gunicorn --bind 0.0.0.0:5000 app:app --daemon

