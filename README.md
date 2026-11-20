# Hospital Management System (HMS)
> Green Hospital of Bangladesh • Smart Hospital Platform

A modular Hospital Management System built with **Laravel 13 (PHP 8.4)** backend API and **React 19 + TypeScript + Vite + Tailwind CSS** frontend.

---

## Project Structure

```text
HMS/
├── apps/
│   ├── provider-api/    # Laravel 13 Backend API (app/Modules/)
│   └── provider-web/    # React 19 + Vite Frontend
├── docker/
│   ├── api/             # PHP 8.4 Dockerfile & entrypoint
│   └── web/             # Node 22 Vite Dockerfile
├── docker-compose.yml   # All services (web, api, postgres, redis)
└── Makefile             # Shortcut commands
```

---

## Quick Start (Docker)

Only **Docker** is required — no local PHP, Composer, or Node setup needed.

```bash
# Start all services (Frontend, Backend API, PostgreSQL, Redis)
make up
```

Services will be available at:
- **Frontend Web**: http://localhost:5173
- **Backend API**: http://localhost:8001
- **PostgreSQL**: `localhost:5432` (`hospital_db` / `hospital_user` / `hospital_secret`)
- **Redis**: `localhost:6379`

---

## Common Commands

```bash
make up          # Build & start all containers
make down        # Stop all containers
make ps          # Check running services
make logs        # Watch container logs
make migrate     # Run database migrations
make test        # Run backend PHPUnit tests
make build-web   # Run frontend TypeScript + Vite production build
make verify      # Run backend tests + frontend build
```
