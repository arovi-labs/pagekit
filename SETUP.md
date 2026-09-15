# Setup Checklist

## Done Automatically
- [x] 4 packages: `@arovi/pagekit-core`, `@arovi/pagekit-mcp`, `@arovi/pagekit-cli`, `@arovi/pagekit-next`
- [x] Python SDK: `pagekit-core` (PyPI)
- [x] CI/CD workflows (Node + Python)
- [x] Release workflow (npm + GitHub Packages + GitHub Releases)
- [x] Issue templates, PR template, CONTRIBUTING guide
- [x] develop → PR → main workflow

## You Need To Do

### 1. GitHub Secrets
Go to repo **Settings → Secrets and variables → Actions** and add:

| Secret | Where to get it |
|--------|-----------------|
| `NPM_TOKEN` | npmjs.com → Access Tokens → Generate New Token (Classic) → `Automation` type |
| `PYPI_TOKEN` | pypi.org → Account → API tokens → Add API token |

### 2. GitHub Topics
Go to repo **Settings → General → Topics** and add:
```
cms  headless-cms  content-api  developer-tools  typescript  nextjs  mcp  ai-agents  open-source  python
```

### 3. Branch Protection (Recommended)
Go to **Settings → Branches → Add rule** for `main`:
- [x] Require pull request before merging
- [x] Require approvals: 1
- [x] Require status checks: `ci (22)`, `ci (24)`, `test (3.12)`, `test (3.13)`
- [x] Require branches to be up to date

### 4. PyPI Trusted Publisher (Optional — replaces PYPI_TOKEN)
Go to pypi.org → **Publishing** → Add a new publisher:
- **PyPI project name:** `pagekit-core`
- **Owner:** `arovi-labs`
- **Repository:** `pagekit`
- **Workflow:** `python-release.yml`

### 5. Enable GitHub Discussions (Optional)
Go to **Settings → General → Features → Discussions**
Categories: General, Ideas, Help, Show & Tell

### 6. First Release
Once secrets are added, push to `main` with a changeset:
```bash
pnpm changeset
# select packages, write summary
git add -A && git commit -m "chore: initial release" && git push
```
