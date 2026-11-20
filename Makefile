.PHONY: up down restart logs ps migrate test build-web verify shell-api shell-web

# Start all services (Web, API, PostgreSQL, Redis)
up:
	docker compose up -d --build

# Stop all services
down:
	docker compose down

# Restart all services
restart:
	docker compose restart

# Follow container logs
logs:
	docker compose logs -f

# Show container status
ps:
	docker compose ps

# Run Laravel migrations inside API container
migrate:
	docker compose exec api php artisan migrate

# Run Backend PHPUnit tests inside API container
test:
	docker compose exec api php artisan test

# Build Frontend inside Web container
build-web:
	docker compose exec web npm run build

# Run all checks (Backend tests + Frontend build)
verify: test build-web

# Open shell inside containers
shell-api:
	docker compose exec api sh

shell-web:
	docker compose exec web sh
