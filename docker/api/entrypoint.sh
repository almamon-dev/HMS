#!/bin/sh
set -e

# Ensure .env exists
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
fi

# Ensure Composer dependencies are installed
if [ ! -f "vendor/autoload.php" ]; then
    composer install --no-interaction --prefer-dist
fi

# Ensure storage directories exist and are writable without altering tracked file modes
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
find storage bootstrap/cache -type d -exec chmod 777 {} +

# Discover Laravel packages in mounted bootstrap/cache
php artisan package:discover --ansi || true

# Generate application key if not set in environment or .env
if [ -z "$APP_KEY" ] && ! grep -qE '^APP_KEY=.+' .env 2>/dev/null; then
    php artisan key:generate --force || true
fi

# Create sqlite database if using sqlite
if [ "$DB_CONNECTION" = "sqlite" ] && [ ! -f "database/database.sqlite" ]; then
    touch database/database.sqlite
    chmod 777 database/database.sqlite
fi

# Run database migrations
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force || true
    php artisan db:seed --force || true
fi

exec "$@"

