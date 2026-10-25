#!/usr/bin/env bash
# ==============================================================================
# PixelLearn — AWS EC2 One-Click Production Setup Script
# ==============================================================================
# This script sets up an Ubuntu EC2 instance for production:
# 1. Creates a 4GB Swapfile (prevents Out-Of-Memory crashes during high student load)
# 2. Installs Node.js 20 LTS, npm, PM2, and Docker Engine
# 3. Grants Docker permissions to the ubuntu user
# 4. Pre-pulls all language execution Docker images (Python, C++, Java, Node)
# 5. Installs Nginx reverse proxy and configures firewall
# ==============================================================================

set -e

echo "🚀 Starting PixelLearn EC2 Production Setup..."

# 1. Update system packages
echo "📦 Updating system packages..."
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y curl git ufw nginx

# 2. Setup 4GB Swap Space (Crucial for 50-60 students on t2/t3.micro or t3.small)
if [ ! -f /swapfile ]; then
    echo "🧠 Configuring 4GB Swap Space..."
    sudo fallocate -l 4G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "vm.swappiness=10" | sudo tee -a /etc/sysctl.conf
    sudo sysctl -p
    echo "✅ Swap configured successfully."
else
    echo "ℹ️  Swapfile already exists. Skipping."
fi

# 3. Install Docker Engine
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker Engine..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    sudo systemctl enable docker
    sudo systemctl start docker
    rm -f get-docker.sh
    echo "✅ Docker installed."
else
    echo "ℹ️  Docker is already installed."
fi

# 4. Install Node.js 20 LTS
if ! command -v node &> /dev/null; then
    echo "🟢 Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo npm install -g pm2
    echo "✅ Node.js and PM2 installed."
else
    echo "ℹ️  Node.js is already installed."
fi

# 5. Pre-pull Docker execution images (instant student executions)
echo "📥 Pre-pulling execution container images (this may take 2-3 minutes)..."
sudo docker pull python:3.12-slim
sudo docker pull gcc:latest
sudo docker pull openjdk:17-slim
sudo docker pull node:18-slim
echo "✅ All execution images pre-pulled."

echo ""
echo "=============================================================================="
echo "🎉 EC2 Environment Setup Complete!"
echo "=============================================================================="
echo "Next steps:"
echo "1. Log out and log back in (or run 'newgrp docker') so docker permissions apply."
echo "2. Clone your repository: git clone <your-repo-url>"
echo "3. Copy your .env file into the project folder."
echo "4. Run: npm install"
echo "5. Run: npx prisma generate"
echo "6. Run: npm run build"
echo "7. Start with PM2: pm2 start npm --name 'pixellearn' -- start"
echo "8. Run: pm2 save && pm2 startup"
echo "=============================================================================="
