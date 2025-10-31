# Contributing to Azora OS

Thank you for your interest in contributing to Azora OS! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please review our Code of Conduct in [codex/CONTRIBUTING.md](codex/CONTRIBUTING.md) before contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/azora-os.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`

## Development Workflow

### Before You Start

- Check existing issues to see if your feature/bug is already being worked on
- For major features, open an issue first to discuss the approach
- Ensure your code follows our coding standards (see below)

### Making Changes

1. **Write Clean Code**
   - Follow TypeScript best practices
   - Use meaningful variable and function names
   - Add comments for complex logic
   - Keep functions small and focused

2. **Testing**
   - Write tests for new features
   - Ensure all existing tests pass: `npm test`
   - Add integration tests when appropriate

3. **Code Quality**
   - Run linter: `npm run lint`
   - Fix any issues: `npm run lint:fix`
   - Format code: `npm run format`

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat(education): add AI tutor integration

Implement Elara AI tutor for primary education modules.
Includes real-time assessment and adaptive learning paths.
```

### Pull Request Process

1. **Update Documentation**
   - Update README.md if needed
   - Add/update API documentation
   - Update CHANGELOG.md (if applicable)

2. **Test Your Changes**
   ```bash
   npm test
   npm run lint
   npm run build:all
   ```

3. **Submit Pull Request**
   - Push to your fork
   - Create PR with clear description
   - Link any related issues
   - Request review from maintainers

## Coding Standards

### TypeScript

- Use strict TypeScript settings
- Prefer interfaces over types for public APIs
- Use `const` and `let`, never `var`
- Prefer async/await over promises
- Use optional chaining and nullish coalescing

### File Organization

- One component/service per file
- Use descriptive file names
- Group related files in directories
- Export from index files when appropriate

### Naming Conventions

- **Files**: `kebab-case.ts` or `PascalCase.tsx` for components
- **Variables/Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Classes/Interfaces**: `PascalCase`
- **Types**: `PascalCase` with `Type` suffix if needed

### Documentation

- Add JSDoc comments for public functions
- Document complex algorithms
- Update README.md for user-facing changes
- Keep inline comments concise and relevant

## Project Structure

```
azora-os/
├── app/              # Next.js application
├── api/              # API server
├── components/       # React components
├── services/         # Business services
├── genome/           # Core AI system
├── tests/            # Test files
├── scripts/          # Utility scripts
└── docs/             # Documentation
```

## Testing Guidelines

- Write unit tests for all services
- Write integration tests for API endpoints
- Aim for >80% code coverage
- Test error cases and edge cases
- Use descriptive test names

## Questions?

- Open an issue for questions or discussions
- Check existing documentation in `docs/` directory
- Contact: support@azora.world

Thank you for contributing to Azora OS! 🚀

