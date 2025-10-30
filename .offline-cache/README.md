# Azora OS Offline Development

This repository is configured for complete offline development.

## What's Cached Locally

### NPM Packages
- Essential dependencies cached in `.offline-cache/npm`
- Use `npm install --offline` for installation

### Docker Images
- Critical images saved in `.offline-cache/docker`
- Load with: `docker load < .offline-cache/docker/image.tar`

### Git Repository
- Optimized repository with large files removed
- Use `git gc` periodically to maintain size

## Offline Development Workflow

1. **Clone Repository**: `git clone <repo-url>`
2. **Load Dependencies**: `npm install --offline`
3. **Load Docker Images**: `docker load < .offline-cache/docker/*.tar`
4. **Start Services**: `docker-compose up -d`
5. **Develop**: All tools work offline

## Services Available Offline

- Azora Workspace (Email & Collaboration)
- MongoDB & Redis databases
- All core development tools

## Troubleshooting

- If npm fails: Clear cache with `npm cache clean --force`
- If Docker fails: Pull images manually when online
- If git is slow: Run `git gc --aggressive`

