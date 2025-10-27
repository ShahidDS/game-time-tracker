#!/bin/bash

echo "🚀 Starting Game Tracker Database..."
docker-compose up -d

echo "📊 Waiting for database to be ready..."
until docker exec game_tracker_db pg_isready -U admin -d game_tracker; do
  echo "Waiting for database..."
  sleep 2
done

echo "✅ Database is ready!"
echo "📝 Connection details:"
echo "   Host: localhost:5432"
echo "   Database: game_tracker"
echo "   Username: admin"
echo "   Password: game123"