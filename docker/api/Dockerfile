FROM php:8.4-cli-alpine

# System packages & PHP extensions required by Laravel (PostgreSQL, SQLite, Redis)
RUN apk add --no-cache \
    bash \
    curl \
    git \
    icu-libs \
    libpng \
    libpq \
    libzip \
    sqlite-libs \
    tzdata \
    && apk add --no-cache --virtual .build-deps \
    autoconf \
    build-base \
    icu-dev \
    libpng-dev \
    libpq-dev \
    libzip-dev \
    sqlite-dev \
    linux-headers \
    && docker-php-ext-install -j"$(nproc)" \
    bcmath \
    intl \
    opcache \
    pcntl \
    pdo_mysql \
    pdo_pgsql \
    pdo_sqlite \
    zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps \
    && rm -rf /tmp/pear

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 1. Install PHP dependencies first (cached unless composer.json / composer.lock changes)
COPY apps/provider-api/composer.json apps/provider-api/composer.lock ./
RUN composer install --no-interaction --prefer-dist --no-scripts --no-autoloader

# 2. Copy Laravel app source and generate autoloader
COPY apps/provider-api ./
RUN rm -f .env && composer dump-autoload --optimize

# Startup script (prepares .env, APP_KEY, migrations, then starts Laravel)
COPY docker/api/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000", "--no-reload"]
