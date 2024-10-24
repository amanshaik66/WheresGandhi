#!/bin/bash

# Firebase Deployment Script for Where's Gandhi
# Ensure you have Firebase CLI installed and authenticated before running this script.

echo "Starting deployment for Where's Gandhi..."

# Navigate to backend and deploy Firebase functions
echo "Deploying backend functions..."
cd ../backend || { echo "Backend folder not found!"; exit 1; }
firebase deploy --only functions || { echo "Failed to deploy backend functions"; exit 1; }

# Navigate to frontend and deploy Firebase hosting
echo "Deploying frontend hosting..."
cd ../frontend || { echo "Frontend folder not found!"; exit 1; }
firebase deploy --only hosting || { echo "Failed to deploy frontend hosting"; exit 1; }

echo "Deployment successful! Your app is live on Firebase."
