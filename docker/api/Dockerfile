FROM php:8.4-cli-alpine

# Install system dependencies & build tools
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

# Copy entrypoint script
COPY docker/api/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

