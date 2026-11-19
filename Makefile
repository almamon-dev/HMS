APP := apps/provider-api
WEB := apps/provider-web

.PHONY: verify test analyse architecture format format-check dev dev-web build-web \
        docker-up docker-down docker-restart docker-logs docker-ps docker-migrate

format:
	$(APP)/vendor/bin/pint $(APP)/app $(APP)/config $(APP)/database $(APP)/routes $(APP)/tests

format-check:
	$(APP)/vendor/bin/pint --test $(APP)/app $(APP)/config $(APP)/database $(APP)/routes $(APP)/tests

analyse:
	cd $(APP) && ./vendor/bin/phpstan analyse --memory-limit=1G

architecture:
	cd $(APP) && ./vendor/bin/deptrac analyse --no-progress

test:
	cd $(APP) && php artisan test

build-web:
	cd $(WEB) && npm run build

verify: format-check architecture analyse test build-web

dev:
	cd $(APP) && php artisan serve

dev-web:
	cd $(WEB) && npm run dev

# Docker Commands
docker-up:
	docker compose up -d --build

docker-down:
	docker compose down

docker-restart:
	docker compose restart

docker-logs:
	docker compose logs -f

docker-ps:
	docker compose ps

docker-migrate:
	docker compose exec api php artisan migrate
