#!/bin/sh
set -e

# Generate application key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force || true
fi

# Create sqlite database if using sqlite
if [ "$DB_CONNECTION" = "sqlite" ] && [ ! -f "database/database.sqlite" ]; then
    touch database/database.sqlite
    chmod 777 database/database.sqlite
fi

# Ensure storage directories exist and have proper permissions
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chmod -R 777 storage bootstrap/cache

# Run database migrations
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force || true
fi

exec "$@"

