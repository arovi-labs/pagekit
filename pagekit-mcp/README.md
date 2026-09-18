<p align="center">
  <img src="https://img.shields.io/npm/v/@arovi/pagekit-mcp" alt="npm version">
  <img src="https://img.shields.io/npm/l/@arovi/pagekit-mcp" alt="License">
  <img src="https://img.shields.io/badge/MCP-compatible-blue" alt="MCP Compatible">
</p>

<h1 align="center">@arovi/pagekit-mcp</h1>

<p align="center">
  <strong>MCP server for PageKit.</strong><br>
  Let AI agents manage your content through the Model Context Protocol.
</p>

---

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io) (MCP) is an open protocol that standardizes how applications provide context to LLMs. With PageKit's MCP server, AI agents like Claude, Codex, and Cursor can directly read and write your content.

---

## Installation

### Global Installation (Recommended)

```bash
pnpm add -g @arovi/pagekit-mcp
# or
npm install -g @arovi/pagekit-mcp
```

### Local Installation

```bash
pnpm add -D @arovi/pagekit-mcp
```

---

## Quick Start

```bash
PAGEKIT_API_KEY=pk_live_... pagekit-mcp
```

The server starts over stdio transport by default and is ready for any MCP-compatible client.

---

## Usage

### Stdio Mode (Default)

```bash
PAGEKIT_API_KEY=pk_live_... pagekit-mcp
```

Best for local development and desktop clients like Claude Desktop.

### HTTP Mode

```bash
PAGEKIT_API_KEY=pk_live_... pagekit-mcp --http
```

Runs on `http://127.0.0.1:3100/mcp`. Configure the port with the `PORT` environment variable.

---

## MCP Client Configuration

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pagekit": {
      "command": "pagekit-mcp",
      "env": {
        "PAGEKIT_API_KEY": "pk_live_...",
        "PAGEKIT_API_URL": "http://localhost:3003/api/v1"
      }
    }
  }
}
```

### Cursor

Copy `.cursor/mcp.json.example` to `.cursor/mcp.json` and set your API key:

```json
{
  "mcpServers": {
    "pagekit": {
      "command": "pagekit-mcp",
      "env": {
        "PAGEKIT_API_KEY": "pk_live_...",
        "PAGEKIT_API_URL": "http://localhost:3003/api/v1"
      }
    }
  }
}
```

### Windsurf / VS Code

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "pagekit": {
      "command": "pagekit-mcp",
      "env": {
        "PAGEKIT_API_KEY": "pk_live_..."
      }
    }
  }
}
```

### Custom HTTP Endpoint

For remote deployments or custom clients:

```json
{
  "mcpServers": {
    "pagekit": {
      "url": "http://127.0.0.1:3100/mcp"
    }
  }
}
```

Start the server with: `PAGEKIT_API_KEY=pk_live_... pagekit-mcp --http`

---

## Available Tools

### Posts

| Tool | Description | Parameters |
|------|-------------|------------|
| `pagekit_list_posts` | List posts with filters | `status`, `author`, `tag`, `category`, `search`, `page`, `limit`, `sort` |
| `pagekit_get_post` | Get a post by ID or slug | `id` or `slug` |
| `pagekit_create_post` | Create a new post | `title`, `content`, `status`, `excerpt`, `slug`, `author`, `tags`, `categories`, `seo` |
| `pagekit_update_post` | Update an existing post | `id`, plus fields to update |
| `pagekit_delete_post` | Delete a post | `id` |

### Taxonomy

| Tool | Description | Parameters |
|------|-------------|------------|
| `pagekit_list_tags` | List all tags | - |
| `pagekit_list_categories` | List all categories | - |

### Authors

| Tool | Description | Parameters |
|------|-------------|------------|
| `pagekit_list_authors` | List author profiles | `sort`, `page`, `limit` |
| `pagekit_get_author` | Get author by ID or slug | `id` or `slug` |
| `pagekit_create_author` | Create an author profile | `name`, `slug`, `email`, `bio`, `avatarUrl`, `userId` |
| `pagekit_update_author` | Update an author profile | `id`, plus fields to update |

### Media

| Tool | Description | Parameters |
|------|-------------|------------|
| `pagekit_list_media` | List media assets | - |
| `pagekit_create_media` | Register a media asset | `url`, `filename`, `mimeType`, `size`, `alt` |
| `pagekit_delete_media` | Delete a media asset | `id` |

### Project

| Tool | Description |
|------|-------------|
| `pagekit_project_info` | Get project info and post counts |
| `pagekit_health` | Check API connectivity |

---

## Using with AI Agents

Once configured, you can interact with your PageKit content naturally:

```
# Posts
"Create a blog post about our new feature with the title 'Launching v2.0'"
"Find all unpublished drafts"
"Update the title of the latest article to 'New Title'"
"Publish the post with slug 'hello-world'"
"Delete the draft post 'work-in-progress'"

# Discovery
"List all posts in the engineering category"
"Show me all tags"
"Find posts authored by Jane"

# Media
"List all media assets"
"Register this image: https://example.com/photo.png"

# Project
"How many published posts do I have?"
"Is the API healthy?"
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PAGEKIT_API_KEY` | Yes | - | Your PageKit API key (`pk_live_...`) |
| `PAGEKIT_API_URL` | No | `http://localhost:3003/api/v1` | API base URL (include `/api/v1`) |
| `PORT` | No | `3100` | HTTP port (only with `--http` flag) |

---

## Development

```bash
# Install dependencies
pnpm install

# Development mode with hot reload
pnpm dev

# Build
pnpm build

# Test with MCP Inspector
pnpm test:inspector
```

---

## Architecture

```
pagekit-mcp/
├── src/
│   ├── index.ts           # Server entry point
│   ├── client.ts          # PageKit API client
│   ├── http.ts            # HTTP transport handler
│   └── tools/
│       ├── index.ts       # Tool registration
│       ├── posts.ts       # Post CRUD tools
│       ├── taxonomy.ts    # Tags and categories
│       ├── authors.ts     # Author CRUD tools
│       ├── media.ts       # Media management
│       └── project.ts     # Project info & health
├── dist/                  # Compiled output
└── package.json
```

---

## Related Packages

- [@arovi/pagekit-core](../pagekit-typescript) - TypeScript SDK
- [@arovi/pagekit-next](../pagekit-next) - Next.js integration
- [@arovi/pagekit-cli](../pagekit-cli) - CLI tooling
- [pagekit-core (Python)](../pagekit-python) - Python client

---

## License

MIT © [Arovi Labs](https://github.com/arovi-labs)
