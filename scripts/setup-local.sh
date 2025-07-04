#!/bin/bash

# Setup local development environment
echo "Setting up local development environment..."

# Install dependencies
npm install

# Setup environment variables
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOL
DATABASE_URL=postgresql://postgres:password@localhost:5432/project_management
JWT_SECRET=$(openssl rand -base64 32)
EOL
fi

# Start Docker containers
docker-compose up -d

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "Running database setup..."
npm run db:setup

echo "Setup complete! Run 'npm run dev' to start the development server."
