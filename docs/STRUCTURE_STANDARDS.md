# Azora OS Structure Standards

This document defines the standard folder structure and organization patterns for Azora OS.

## Service Structure Standard

All services should follow this structure:

```
service-name/
├── README.md              # Service documentation
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration (if using TS)
├── Dockerfile             # Docker configuration (optional)
├── docker-compose.yml     # Docker Compose config (optional)
├── .env.example           # Environment variable template
├── src/                   # Source code
│   ├── index.ts          # Main entry point
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── utils/            # Utility functions
├── prisma/                # Database schema (if using Prisma)
│   └── schema.prisma
├── tests/                 # Test files
│   └── *.test.ts
└── scripts/               # Utility scripts
    └── *.js
```

## Organ Structure Standard

All organs (system organs/services) should follow this structure:

```
organ-name/
├── README.md              # Organ documentation
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config (if using TS)
├── index.js               # Main entry point
├── src/                   # Source code (if complex)
└── docker/                # Docker configs (optional)
```

## UI Component Structure

UI components should be organized as:

```
ui/
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (shadcn)
│   ├── layout/           # Layout components
│   ├── services/         # Service-specific components
│   └── shared/           # Shared components
├── app/                  # Next.js app directory
├── lib/                  # Utility libraries
│   ├── utils.ts
│   └── hooks/           # Custom React hooks
├── styles/               # Global styles
└── public/               # Static assets
```

## Naming Conventions

### Files and Folders
- **Folders**: `kebab-case` (e.g., `user-service`, `api-gateway`)
- **Files**: 
  - TypeScript: `camelCase.ts` or `PascalCase.tsx` for components
  - JavaScript: `camelCase.js`
  - Config files: Follow tool conventions (e.g., `tsconfig.json`, `package.json`)

### Documentation
- Always use `README.md` (not `README`, `readme.md`, or `Readme.md`)
- Place README in the root of each service/organ/package

### Configuration Files
- `package.json` - Always in service root
- `tsconfig.json` - Always in service root if using TypeScript
- `Dockerfile` - Optional, in service root or `docker/` folder
- `.env.example` - Environment variable template in service root

## Required Files

Every service must have:
1. `README.md` - Documentation
2. `package.json` - Dependencies and scripts
3. Entry point (`index.js`, `index.ts`, or `src/index.ts`)

## Optional but Recommended

- `tsconfig.json` - If using TypeScript
- `Dockerfile` - For containerization
- `tests/` - Test files
- `prisma/schema.prisma` - If using Prisma ORM

## File Organization Rules

1. **Source Code**: Always in `src/` directory for complex services
2. **Tests**: Always in `tests/` or `__tests__/` directory
3. **Scripts**: Utility scripts in `scripts/` directory
4. **Config**: Configuration files in root or `config/` directory
5. **Documentation**: README.md always in service root

## Examples

### Good Structure ✅
```
azora-mint/
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── services/
│   └── routes/
└── tests/
```

### Bad Structure ❌
```
service/
├── readme (wrong name)
├── main.ts (should be in src/)
├── test.ts (should be in tests/)
└── config.ts (should be in config/ or src/config/)
```

## Migration Checklist

When organizing a service, ensure:
- [ ] README.md exists and is properly named
- [ ] package.json is in root
- [ ] Source code organized in src/ (if complex)
- [ ] Tests in tests/ or __tests__/
- [ ] No loose files in root (except configs)
- [ ] TypeScript config in root if using TS
- [ ] Docker files properly placed

---

**Last Updated**: October 31, 2025

