#!/bin/bash

CONFIG_FILE="./conf/bash/.deploy_config"

# Function to save state
save_config() {
  echo "DOCKER_INSTALLED=$DOCKER_INSTALLED" > $CONFIG_FILE
  echo "CICD_USED=$CICD_USED" >> $CONFIG_FILE
  echo "CICD_TYPE=$CICD_TYPE" >> $CONFIG_FILE
  echo "ENV_CHANGED=$ENV_CHANGED" >> $CONFIG_FILE
  echo "SERVER_RAN=$SERVER_RAN" >> $CONFIG_FILE
}

# Function to load previous config
load_config() {
  source $CONFIG_FILE
}

# Start script
echo "🚀 Starting Deployment Script"

# Check if script was run before
if [ -f "$CONFIG_FILE" ]; then
  echo "🔁 Previous configuration detected."

  read -p "Do you want to edit previous configuration? (y/n): " EDIT_CONFIG
  if [[ "$EDIT_CONFIG" =~ ^(y|Y|yes|YES)$ ]]; then
    rm $CONFIG_FILE
  else
    echo "⚙️ Resuming with previous configuration..."
    load_config
  fi
fi

# Docker installation
if [ -z "$DOCKER_INSTALLED" ]; then
  read -p "Do you want to install Docker? (y/n): " INSTALL_DOCKER
  if [[ "$INSTALL_DOCKER" =~ ^(y|Y|yes|YES)$ ]]; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com | bash
    DOCKER_INSTALLED=true
  else
    echo "⏩ Skipping Docker installation."
    DOCKER_INSTALLED=false
  fi
  save_config
fi

# sudo su (note: real `sudo su` will switch shell, better to advise user)
echo "🔒 Switching to superuser (requires password)..."
sudo su <<EOF
# Now inside root user, continuing script
EOF

# CI/CD pipeline
# if [ -z "$CICD_USED" ]; then
#   read -p "Will you use CI/CD pipeline? (y/n): " USE_CICD
#   if [[ "$USE_CICD" =~ ^(y|Y|yes|YES)$ ]]; then
#     CICD_USED=true
#     echo "Choose your CI/CD tool:"
#     echo "1. GitHub Actions"
#     echo "2. Jenkins"
#     read -p "Enter option (1 or 2): " CICD_OPTION
#     if [ "$CICD_OPTION" == "1" ]; then
#       mv github .github 2>/dev/null
#       CICD_TYPE="github"
#     elif [ "$CICD_OPTION" == "2" ]; then
#       CICD_TYPE="jenkins"
#     else
#       echo "❌ Invalid option. Skipping CI/CD."
#       CICD_USED=false
#     fi
#   else
#     CICD_USED=false
#   fi
#   save_config
# fi

# Environment variable setup
if [ -z "$ENV_CHANGED" ]; then
  read -p "Do you want to change env variables? (y/n): " CHANGE_ENV
  if [[ "$CHANGE_ENV" =~ ^(n|N|no|NO)$ ]]; then
    cp .env.sample .env 2>/dev/null
    ENV_CHANGED=false
  else
    echo "🛠️ Please edit the .env.sample file manually and rename it to .env"
    ENV_CHANGED=true
  fi
  save_config
fi

# Run the server
if [ -z "$SERVER_RAN" ]; then
  read -p "Do you want to run the server now? (y/n): " RUN_SERVER
  if [[ "$RUN_SERVER" =~ ^(y|Y|yes|YES)$ ]]; then
    echo "🚀 Starting server with Docker Compose..."
    sudo docker compose up --build --force-recreate --remove-orphans -d
    SERVER_RAN=true
  else
    echo "⛔ Server launch skipped."
    SERVER_RAN=false
  fi
  save_config
fi

echo "✅ Deployment script completed."
