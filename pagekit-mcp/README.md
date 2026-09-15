# @arovi/pagekit-mcp

MCP server for [PageKit](https://github.com/arovi-labs/pagekit) — lets AI agents manage your content.

## Install

```bash
npm install -g @arovi/pagekit-mcp
```

## Usage

```bash
PAGEKIT_API_KEY=pk_live_... pagekit-mcp
```

This starts the MCP server over stdio, ready for Claude, Codex, Cursor, or any MCP-compatible client.

### HTTP mode

```bash
PAGEKIT_API_KEY=pk_live_... pagekit-mcp --http
```

Runs on `http://127.0.0.1:3100/mcp`.

## MCP Client Configuration

### Claude Desktop

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

### Cursor

Add to `.cursor/mcp.json`:

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

## Tools

| Tool | Description |
|------|-------------|
| `pagekit_list_posts` | List posts with filters (status, author, tag, search) |
| `pagekit_get_post` | Get a post by ID or slug |
| `pagekit_create_post` | Create a new post |
| `pagekit_update_post` | Update an existing post |
| `pagekit_delete_post` | Delete a post |
| `pagekit_list_tags` | List all tags |
| `pagekit_list_categories` | List all categories |
| `pagekit_list_authors` | List all authors |
| `pagekit_list_media` | List media assets |
| `pagekit_create_media` | Register a media asset |
| `pagekit_delete_media` | Delete a media asset |
| `pagekit_project_info` | Get project info and post counts |
| `pagekit_health` | Check API health |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PAGEKIT_API_KEY` | Yes | Your PageKit API key (`pk_live_...`) |
| `PAGEKIT_API_URL` | No | API base URL (default: `http://localhost:3000`) |
| `PORT` | No | HTTP port (default: `3100`, only with `--http`) |

## License

MIT © [Arovi Labs](https://github.com/arovi-labs)
