#!/bin/bash

# Habit-AI Deployment Script
# Usage: ./deploy.sh [platform] [environment]

set -e

PLATFORM=${1:-heroku}
ENV=${2:-staging}
COLOR_RED='\033[0;31m'
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${COLOR_YELLOW}🚀 Deploying Habit-AI to $PLATFORM ($ENV)${NC}"

# Check prerequisites
check_prerequisites() {
    echo "Checking prerequisites..."
    
    case $PLATFORM in
        heroku)
            if ! command -v heroku &> /dev/null; then
                echo -e "${COLOR_RED}Heroku CLI not found. Install with: npm install -g heroku${NC}"
                exit 1
            fi
            ;;
        aws)
            if ! command -v aws &> /dev/null; then
                echo -e "${COLOR_RED}AWS CLI not found. Install from https://aws.amazon.com/cli/${NC}"
                exit 1
            fi
            if ! command -v terraform &> /dev/null; then
                echo -e "${COLOR_RED}Terraform not found. Install from https://terraform.io${NC}"
                exit 1
            fi
            ;;
    esac
    
    if ! command -v docker &> /dev/null; then
        echo -e "${COLOR_RED}Docker not found. Install from https://docker.com${NC}"
        exit 1
    fi
    
    echo -e "${COLOR_GREEN}✓ All prerequisites met${NC}"
}

# Validate configuration
validate_config() {
    echo "Validating configuration..."
    
    if [ ! -f "backend/.env" ]; then
        echo -e "${COLOR_YELLOW}Creating backend/.env from template...${NC}"
        cp backend/.env.example backend/.env
        echo -e "${COLOR_RED}⚠ Update backend/.env with your values${NC}"
    fi
    
    if [ ! -f "frontend/.env" ]; then
        echo -e "${COLOR_YELLOW}Creating frontend/.env from template...${NC}"
        cp frontend/.env.example frontend/.env
    fi
    
    echo -e "${COLOR_GREEN}✓ Configuration validated${NC}"
}

# Build Docker images
build_images() {
    echo "Building Docker images..."
    docker-compose -f docker-compose.yml build --no-cache
    echo -e "${COLOR_GREEN}✓ Images built successfully${NC}"
}

# Deploy to Heroku
deploy_heroku() {
    echo "Deploying to Heroku..."
    
    HEROKU_BACKEND_APP=${HEROKU_BACKEND_APP:-"habit-ai-backend"}
    HEROKU_FRONTEND_APP=${HEROKU_FRONTEND_APP:-"habit-ai-frontend"}
    
    echo "Backend app: $HEROKU_BACKEND_APP"
    echo "Frontend app: $HEROKU_FRONTEND_APP"
    
    # Check if apps exist
    if ! heroku apps:info $HEROKU_BACKEND_APP >/dev/null 2>&1; then
        echo "Creating Heroku backend app..."
        heroku create $HEROKU_BACKEND_APP --stack container
        heroku addons:create heroku-postgresql:hobby-dev -a $HEROKU_BACKEND_APP
    fi
    
    if ! heroku apps:info $HEROKU_FRONTEND_APP >/dev/null 2>&1; then
        echo "Creating Heroku frontend app..."
        heroku create $HEROKU_FRONTEND_APP --stack container
    fi
    
    # Set environment variables
    echo "Setting environment variables..."
    heroku config:set -a $HEROKU_BACKEND_APP SECRET_KEY=$(openssl rand -base64 32)
    heroku config:set -a $HEROKU_FRONTEND_APP REACT_APP_API_URL=https://$HEROKU_BACKEND_APP.herokuapp.com
    
    # Deploy backend
    echo "Deploying backend..."
    cd backend
    heroku container:push web -a $HEROKU_BACKEND_APP
    heroku container:release web -a $HEROKU_BACKEND_APP
    cd ..
    
    # Deploy frontend
    echo "Deploying frontend..."
    cd frontend
    heroku container:push web -a $HEROKU_FRONTEND_APP
    heroku container:release web -a $HEROKU_FRONTEND_APP
    cd ..
    
    echo -e "${COLOR_GREEN}✓ Heroku deployment complete!${NC}"
    echo "Backend: https://$HEROKU_BACKEND_APP.herokuapp.com"
    echo "Frontend: https://$HEROKU_FRONTEND_APP.herokuapp.com"
}

# Deploy to AWS
deploy_aws() {
    echo "Deploying to AWS..."
    
    AWS_REGION=${AWS_REGION:-"us-east-1"}
    
    cd infra/aws
    
    terraform init
    terraform validate
    
    echo "Planning Terraform deployment..."
    terraform plan -out=planfile
    
    read -p "Apply changes? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        terraform apply planfile
        echo -e "${COLOR_GREEN}✓ AWS deployment complete!${NC}"
    else
        echo "Deployment cancelled"
    fi
    
    cd ../..
}

# Deploy with Docker Compose (local)
deploy_local() {
    echo "Starting Docker Compose stack..."
    docker-compose up -d
    
    echo -e "${COLOR_GREEN}✓ Local deployment complete!${NC}"
    echo "Frontend: http://localhost:3000"
    echo "Backend: http://localhost:8000"
    echo "Docs: http://localhost:8000/docs"
}

# Main script
main() {
    check_prerequisites
    validate_config
    
    case $PLATFORM in
        heroku)
            build_images
            deploy_heroku
            ;;
        aws)
            deploy_aws
            ;;
        local|docker)
            deploy_local
            ;;
        *)
            echo -e "${COLOR_RED}Unknown platform: $PLATFORM${NC}"
            echo "Available platforms: heroku, aws, local"
            exit 1
            ;;
    esac
    
    echo -e "${COLOR_GREEN}✅ Deployment successful!${NC}"
}

main "$@"
