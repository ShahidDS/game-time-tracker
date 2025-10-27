#!/bin/bash

echo "🔄 Resetting Game Tracker Database..."
docker-compose down
docker volume rm game-time-tracker_postgres_data 2>/dev/null || echo "Volume already removed or doesn't exist"
docker-compose up -d

echo "📊 Waiting for database to be ready..."
until docker exec game_tracker_db pg_isready -U admin -d game_tracker; do
  echo "Waiting for database..."
  sleep 2
done

echo "✅ Database reset complete!"