# Azora OS - Comprehensive Deployment Guide

## Overview

This guide provides complete instructions for deploying all Azora OS applications and services to Vercel and other platforms.

## Architecture

Azora OS consists of multiple interconnected applications:

### Primary Applications

1. **Main Platform** (`/`) - Next.js
   - Core Azora OS interface
   - Central dashboard and orchestration
   - Deploy: `vercel --prod`

2. **Elara IDE** (`/elara-ide`) - Next.js
   - AI-powered development environment
   - Port: 3002
   - Deploy: `cd elara-ide && vercel --prod`

3. **Marketplace UI** (`/marketplace-ui`) - Vite/React
   - Service marketplace and catalog
   - Port: 3000
   - Deploy: `cd marketplace-ui && vercel --prod`

4. **Pay UI** (`/pay-ui`) - Vite/React
   - Payment and financial services
   - Port: 3000
   - Deploy: `cd pay-ui && vercel --prod`

### Synapse Applications

5. **Academy UI** (`/synapse/academy-ui`) - Next.js
   - Educational platform
   - Deploy: `cd synapse/academy-ui && vercel --prod`

6. **Vigil UI** (`/synapse/vigil-ui`) - Next.js
   - Security monitoring
   - Deploy: `cd synapse/vigil-ui && vercel --prod`

7. **Frontend** (`/synapse/frontend`) - Vite/React
   - General frontend interface
   - Deploy: `cd synapse/frontend && vercel --prod`

### Azora Sub-Applications

8. **Mint Mine Engine** (`/azora/azora-mint-mine-engine-next`) - Next.js
   - Mining and minting interface
   - Deploy: `cd azora/azora-mint-mine-engine-next && vercel --prod`

## Pre-Deployment Checklist

### 1. Environment Variables

Create `.env.local` files in each application:

```bash
# Main App
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.azora-os.com
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Elara IDE
NODE_ENV=production
NEXT_PUBLIC_ELARA_API=https://api.azora-os.com/elara

# Marketplace/Pay UI
VITE_API_URL=https://api.azora-os.com
VITE_APP_NAME=Azora Marketplace
```

### 2. Install Dependencies

```bash
# Root
npm install

# Each UI
cd elara-ide && npm install
cd marketplace-ui && npm install
cd pay-ui && npm install
cd synapse/academy-ui && npm install
cd synapse/vigil-ui && npm install
cd azora/azora-mint-mine-engine-next && npm install
```

### 3. Build Tests

```bash
# Test main app build
npm run build

# Test Elara IDE
cd elara-ide && npm run build

# Test Vite apps
cd marketplace-ui && npm run build
cd pay-ui && npm run build
```

## Deployment Commands

### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy Main App
vercel --prod

# Deploy Elara IDE
cd elara-ide
vercel --prod

# Deploy Marketplace UI
cd marketplace-ui
vercel --prod

# Deploy Pay UI
cd pay-ui
vercel --prod

# Deploy Synapse Apps
cd synapse/academy-ui && vercel --prod
cd synapse/vigil-ui && vercel --prod
cd synapse/frontend && vercel --prod

# Deploy Azora Apps
cd azora/azora-mint-mine-engine-next && vercel --prod
```

### Automated Deployment

Use the deployment script:

```bash
npm run deploy:all
```

## Post-Deployment

### 1. Verify Deployments

```bash
# Check all deployments
vercel ls

# Test endpoints
curl https://azora-os.vercel.app/api/health
curl https://elara-ide.vercel.app/api/health
```

### 2. Configure Custom Domains

```bash
# Add custom domains
vercel domains add azora-os.com
vercel domains add ide.azora-os.com
vercel domains add marketplace.azora-os.com
vercel domains add pay.azora-os.com
```

### 3. Set Environment Variables

```bash
# Via Vercel CLI
vercel env add NEXT_PUBLIC_API_URL production
vercel env add SUPABASE_URL production
```

### 4. Monitor Deployments

- Visit [Vercel Dashboard](https://vercel.com/dashboard)
- Check deployment logs
- Monitor performance metrics
- Set up alerts

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript Errors

```bash
# Check types
npx tsc --noEmit

# Fix common issues
npm run lint:fix
```

### Environment Variable Issues

```bash
# Verify .env.local exists
cat .env.local

# Add missing variables
vercel env pull .env.local
```

## Continuous Deployment

### GitHub Integration

1. Connect repository to Vercel
2. Enable automatic deployments
3. Configure branch deployment rules
4. Set up preview deployments

### Deployment Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Performance Optimization

### 1. Image Optimization

- Use Next.js Image component
- Configure image domains in next.config.ts
- Enable image optimization in Vercel

### 2. Bundle Size

```bash
# Analyze bundle
npm run build
npx @next/bundle-analyzer
```

### 3. Caching Strategy

- Configure edge caching
- Set appropriate cache headers
- Use ISR for dynamic content

## Security

### 1. API Keys

- Store in Vercel environment variables
- Never commit to repository
- Rotate regularly

### 2. CORS Configuration

```typescript
// next.config.ts
headers: async () => [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' },
    ],
  },
];
```

### 3. Rate Limiting

- Configure in Vercel settings
- Use middleware for API protection
- Monitor usage patterns

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Fix issues
npm audit fix
```

### Backup Strategy

- Enable Vercel deployment history
- Backup database regularly
- Version control all configuration

## Support

For deployment issues:
- Check Vercel documentation
- Review deployment logs
- Contact Azora support

---

**Last Updated**: 2025-10-31
**Maintained by**: Azora ES (Pty) Ltd
**License**: AZORA PROPRIETARY LICENSE
