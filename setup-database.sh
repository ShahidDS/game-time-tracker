#!/bin/bash

echo "🔧 Setting up Game Tracker Database..."

# Stop any existing containers
echo "🛑 Stopping any existing containers..."
docker-compose down 2>/dev/null
docker rm -f game_tracker_db 2>/dev/null

# Remove existing volume
echo "🗑️  Removing existing volumes..."
docker volume rm game-time-tracker_postgres_data 2>/dev/null || true

# Start fresh database
echo "🐘 Starting PostgreSQL container..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
for i in {1..30}; do
    if docker exec game_tracker_db pg_isready -U admin -d game_tracker > /dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    echo "Waiting for database... ($i/30)"
    sleep 2
done

# Test connection
echo "🔌 Testing database connection..."
docker exec game_tracker_db psql -U admin -d game_tracker -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed!"
    echo "📋 Container logs:"
    docker logs game_tracker_db
    exit 1
fi

echo ""
echo "🎉 Database setup complete!"
echo "📊 Connection details:"
echo "   Host: localhost:5432"
echo "   Database: game_tracker"
echo "   Username: admin"
echo "   Password: game123"
echo ""
echo "🚀 Next steps:"
echo "   cd server"
echo "   npx prisma generate"
echo "   npx prisma db push"
echo "   npm run db:seed"