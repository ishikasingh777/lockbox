#!/usr/bin/env bash
set -o errexit  # Exit on error

# Install dependencies from requirements.txt
pip install --upgrade pip
pip install -r requirements.txt

# Collect static files (for deployment)
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate
