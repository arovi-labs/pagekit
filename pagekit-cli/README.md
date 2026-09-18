<p align="center">
  <img src="https://img.shields.io/npm/v/@arovi/pagekit-cli" alt="npm version">
  <img src="https://img.shields.io/npm/l/@arovi/pagekit-cli" alt="License">
</p>

<h1 align="center">@arovi/pagekit-cli</h1>

<p align="center">
  <strong>CLI for PageKit.</strong><br>
  Scaffold projects, configure the SDK, and manage content from your terminal.
</p>

---

## Installation

### Global Installation (Recommended)

```bash
pnpm add -g @arovi/pagekit-cli
# or
npm install -g @arovi/pagekit-cli
```

### Using with npx (No Install)

```bash
npx @arovi/pagekit-cli init
```

---

## Quick Start

```bash
# In your project directory
pagekit init
```

The CLI will:
1. Detect your framework (Next.js, Astro, Nuxt, SvelteKit, Vite, Remix, Gatsby)
2. Ask what you're building
3. Create or update `.env.local` with `PAGEKIT_API_KEY`
4. Install `@arovi/pagekit-core` automatically

---

## Commands

### `pagekit init`

Initialize PageKit in your current project.

```bash
pagekit init
```

**Interactive prompts:**
- What are you building? (Blog, Changelog, Docs, Marketing site, Custom)
- Framework auto-detected from config files

**Actions performed:**
- Creates/updates `.env.local` with `PAGEKIT_API_KEY`
- Installs `@arovi/pagekit-core` (detects your package manager: pnpm, yarn, or npm)
- Shows next steps to start building

---

### `pagekit --version`

Show the CLI version.

### `pagekit --help`

Show all available commands and options.

---

## Framework Detection

The CLI automatically detects your framework by checking for config files:

| Framework | Detection Files |
|-----------|----------------|
| Next.js | `next.config.js`, `next.config.mjs`, `next.config.ts` |
| Astro | `astro.config.mjs`, `astro.config.ts` |
| Nuxt | `nuxt.config.ts`, `nuxt.config.js` |
| SvelteKit | `svelte.config.js`, `svelte.config.ts` |
| Vite | `vite.config.ts`, `vite.config.js` |
| Remix | `remix.config.js`, `remix.config.ts` |
| Gatsby | `gatsby.config.js`, `gatsby.config.ts` |

---

## Example Workflow

```bash
# 1. Create a new Next.js project
npx create-next-app@latest my-blog
cd my-blog

# 2. Initialize PageKit
pagekit init
# ? What are you building? › Blog
# ✓ Next.js detected
# ✓ Created .env.local with PAGEKIT_API_KEY
# ✓ Installed @arovi/pagekit-core

# 3. Set your API key
echo "PAGEKIT_API_KEY=pk_live_..." > .env.local

# 4. Start building
cat > app/blog/page.tsx << 'EOF'
import { getPosts } from "@arovi/pagekit-next";

export default async function Blog() {
  const { data: posts } = await getPosts({ status: "published" });

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
EOF
```

---

## Environment Variables

After running `pagekit init`, the following environment variable is configured in `.env.local`:

| Variable | Description |
|----------|-------------|
| `PAGEKIT_API_KEY` | Your PageKit API key - get it from your PageKit dashboard |

---

## Package Manager Support

The CLI automatically detects and uses your package manager:

- **pnpm** - if `pnpm-lock.yaml` exists
- **Yarn** - if `yarn.lock` exists
- **npm** - fallback

---

## Development

```bash
# Install dependencies
pnpm install

# Development mode with hot reload
pnpm dev

# Build
pnpm build

# Type check
pnpm typecheck
```

---

## Related Packages

- [@arovi/pagekit-core](../pagekit-typescript) - TypeScript SDK
- [@arovi/pagekit-mcp](../pagekit-mcp) - MCP server for AI agents
- [@arovi/pagekit-next](../pagekit-next) - Next.js integration
- [pagekit-core (Python)](../pagekit-python) - Python client

---

## License

MIT © [Arovi Labs](https://github.com/arovi-labs)
