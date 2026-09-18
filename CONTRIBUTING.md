# Contributing to PageKit

Thanks for your interest in contributing! Here's the workflow we follow.

## Development Workflow

### 1. Create an Issue

Every change starts with an issue. Go to [Issues](https://github.com/arovi-labs/pagekit/issues/new/choose) and pick a template:

- **Feature Request** - new functionality
- **Bug Report** - something broken
- **Documentation** - docs improvements

Assign yourself to the issue.

### 2. Create a Branch from `develop`

```bash
git checkout develop
git pull origin develop
git checkout -b feat/your-feature-name
```

Branch naming:
- `feat/` - new features
- `fix/` - bug fixes
- `docs/` - documentation
- `chore/` - maintenance, deps, CI

### 3. Make Your Changes

```bash
# Install dependencies (if needed)
pnpm install

# Work on your changes
# ...

# Build and verify
pnpm build
pnpm typecheck
pnpm --filter @arovi/pagekit-core test
```

### 4. Create a Changeset

If your change affects published packages:

```bash
pnpm changeset
```

Follow the prompts to select packages and write a summary.

### 5. Commit and Push

```bash
git add -A
git commit -m "feat: add new feature"
git push -u origin feat/your-feature-name
```

### 6. Create a PR to `main`

- Base: `main`
- Head: `your-branch`
- In the PR description, add: `Closes #<issue-number>`
- Assign yourself
- The PR template will guide you through the checklist

### 7. CI Runs

CI automatically runs on your PR:
- Build on Node 22 & 24
- Typecheck
- Tests

Wait for all checks to pass.

### 8. Merge

Once CI passes, merge the PR. This triggers the **Release workflow** which:
- Publishes to npm
- Publishes to GitHub Packages
- Creates a GitHub Release (if there are changesets)

## Project Structure

```
pagekit/
├── pagekit-typescript/  # @arovi/pagekit-core
├── pagekit-mcp/         # @arovi/pagekit-mcp
├── pagekit-cli/         # @arovi/pagekit-cli
├── pagekit-python/      # Python content client
├── examples/
├── docs/
└── .github/
```

## Working on a Package

Each package has its own scripts:

```bash
cd pagekit-typescript

pnpm dev          # Watch mode
pnpm build        # Build once
pnpm test         # Run tests
pnpm typecheck    # Type-check
```

## Code Style

- TypeScript strict mode
- No comments unless the logic isn't self-evident
- Follow existing patterns in the codebase
- Keep things simple - don't over-engineer

## Branch Protection (Recommended)

Set these in GitHub repo settings → Branches → `main`:

- Require pull request before merging
- Require approvals: 1
- Require status checks to pass: `ci (22)`, `ci (24)`
- Require branches to be up to date
- Require conversation resolution
- Do not allow bypassing the above settings

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
