# Course Tracker - Docker & CI/CD Setup

## Overview
This repository contains Docker configuration and Jenkins CI/CD pipeline for the Course Tracker React application.

## Quick Start

### Local Development
```bash
# Using Docker Compose for development
docker-compose --profile development up --build

# Or run locally
npm install
npm start
```

### Production Deployment
```bash
# Build and run production container
docker-compose --profile production up -d --build

# Or build Docker image directly
docker build -t course-tracker .
docker run -p 80:80 course-tracker
```

## Docker Configuration

### Dockerfile
- **Multi-stage build** for optimized production images
- **Node.js 18** for building React application
- **Nginx Alpine** for serving static files
- **Health checks** and security headers included

### Docker Compose Profiles
- `development` - Hot-reload development server
- `production` - Production-ready Nginx server
- `monitoring` - Prometheus + Grafana stack
- `redis` - Redis session storage

## Jenkins CI/CD Pipeline

### Pipeline Stages
1. **Checkout** - Clone repository and get git info
2. **Setup Node.js** - Prepare build environment
3. **Install Dependencies** - Run `npm ci`
4. **Lint & Code Quality** - ESLint and security audit
5. **Build Application** - Create production build
6. **Run Tests** - Execute test suite with coverage
7. **Build Docker Image** - Multi-stage Docker build
8. **Security Scan** - Container vulnerability scanning
9. **Push to Registry** - Push to Docker Hub (main/develop branches)
10. **Deploy to Staging** - Auto-deploy develop branch
11. **Deploy to Production** - Manual approval for main branch

### Required Jenkins Configuration

#### Credentials
```bash
# Docker Hub credentials (ID: docker-hub-creds)
Username: your-dockerhub-username
Password: your-dockerhub-token
```

#### Pipeline Parameters
- `FORCE_DEPLOY` - Force deployment on any branch
- `DEPLOY_TO_PROD` - Enable production deployment
- `SKIP_TESTS` - Skip test execution (not recommended)

#### Environment Variables
- `DOCKER_HUB_CREDENTIALS` - Docker registry credentials
- `DOCKER_IMAGE_NAME` - Target image name
- `NODE_VERSION` - Node.js version for build

### Branch Strategy
- `main/master` - Production releases (manual approval required)
- `develop` - Auto-deploy to staging environment
- `feature/*` - Build and test only

## Deployment Commands

### Development
```bash
# Start development server
docker-compose --profile development up

# With file watching
docker-compose --profile development up --build
```

### Production
```bash
# Production deployment
docker-compose --profile production up -d

# With monitoring stack
docker-compose --profile production --profile monitoring up -d

# Scale the application
docker-compose --profile production up -d --scale course-tracker=3
```

### Health Checks
```bash
# Check application health
curl http://localhost/health

# Check container status
docker-compose ps

# View logs
docker-compose logs course-tracker
```

## Environment Variables

### Build Time
- `NODE_ENV` - Application environment
- `DOCKER_TAG` - Image tag for deployment
- `DOCKER_IMAGE` - Image name

### Runtime
- `PORT` - Application port (default: 80)
- `NODE_ENV` - Runtime environment

## Monitoring & Logging

### Prometheus Metrics
- Access Prometheus at `http://localhost:9090`
- Configure scraping in `monitoring/prometheus.yml`

### Grafana Dashboards
- Access Grafana at `http://localhost:3001`
- Default credentials: admin/admin123

### Application Logs
```bash
# View application logs
docker-compose logs -f course-tracker

# View nginx access logs
docker exec -it course-tracker tail -f /var/log/nginx/access.log
```

## Security Features

### Container Security
- Non-root user execution
- Multi-stage builds (no build tools in production)
- Minimal Alpine base images
- Security headers in Nginx configuration

### CI/CD Security
- Vulnerability scanning with Trivy
- Dependency audit with npm audit
- Secured Docker registry credentials
- Branch-based deployment controls

## Troubleshooting

### Common Issues
```bash
# Clear Docker cache
docker system prune -f

# Rebuild without cache
docker-compose build --no-cache

# Check container resources
docker stats

# Debug container interactively
docker run -it --rm course-tracker sh
```

### Build Failures
- Ensure Node.js version compatibility
- Check network connectivity for npm installs
- Verify Dockerfile syntax
- Check available disk space

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes and test locally
4. Push to GitHub
5. Jenkins will automatically build and test
6. Create pull request for review
7. Merge triggers deployment pipeline

## Support

For issues with Docker or CI/CD setup:
1. Check Jenkins build logs
2. Verify Docker configuration
3. Review application logs
4. Contact DevOps team

---

**Repository**: https://github.com/Suhar121/course_tracker.git  
**Docker Hub**: https://hub.docker.com/r/suhar121/course-tracker