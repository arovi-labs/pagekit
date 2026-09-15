# Contributing to PageKit

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/arovi-labs/pagekit.git
cd pagekit

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## Project Structure

```
packages/
├── sdk/    # @pagekit/sdk — TypeScript content client
├── mcp/    # @pagekit/mcp — MCP server for AI agents
├── next/   # Next.js integration (coming soon)
└── cli/    # CLI tooling (coming soon)
```

## Working on a Package

Each package has its own scripts:

```bash
cd packages/sdk

pnpm dev          # Watch mode
pnpm build        # Build once
pnpm typecheck    # Type-check without emitting
```

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `pnpm build` to verify everything compiles
4. Submit a PR with a clear description

## Code Style

- TypeScript strict mode
- No comments unless the logic isn't self-evident
- Follow existing patterns in the codebase
- Keep things simple — don't over-engineer

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
