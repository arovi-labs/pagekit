<p align="center">
  <img src="https://img.shields.io/pypi/v/pagekit-core" alt="PyPI version">
  <img src="https://img.shields.io/pypi/l/pagekit-core" alt="License">
  <img src="https://img.shields.io/pypi/pyversions/pagekit-core" alt="Python versions">
</p>

<h1 align="center">pagekit-core</h1>

<p align="center">
  <strong>Python client for the PageKit content API.</strong><br>
  Sync and async support, fully typed, and production-ready.
</p>

---

## Installation

```bash
pip install pagekit-core
# or
poetry add pagekit-core
# or
uv pip install pagekit-core
```

**Requires:** Python >= 3.10

---

## Quick Start

```python
from pagekit import Pagekit

client = Pagekit(api_key="pk_live_...")

# List posts
page = client.posts.list(status="published", limit=10)
for post in page.data:
    print(post.title)

# Get a post by slug
post = client.posts.get_by_slug("hello-world")

# Create a post
post = client.posts.create(
    title="Hello world",
    content="<p>First post</p>",
    status="published",
)

# Update a post
updated = client.posts.update("post-id", title="Updated title")

# Delete a post
client.posts.delete("post-id")
```

---

## Async Support

The client provides full async support with `AsyncPagekit`:

```python
from pagekit import AsyncPagekit

client = AsyncPagekit(api_key="pk_live_...")

# List posts
page = await client.posts.list(status="published")

# Get by slug
post = await client.posts.get_by_slug("hello-world")

# Create a post
post = await client.posts.create(
    title="Hello world",
    content="<p>First post</p>",
)

# Update
updated = await client.posts.update("post-id", title="Updated")

# Delete
await client.posts.delete("post-id")
```

---

## Configuration

```python
from pagekit import Pagekit

client = Pagekit(
    api_key="pk_live_...",                          # Required
    base_url="https://api.pagekit.cc/v1",           # Optional, default shown
    timeout=30,                                      # Optional, seconds
    headers={"X-Custom-Header": "value"},           # Optional
)
```

### Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `api_key` | `str` | Yes | — | Your PageKit API key |
| `base_url` | `str` | No | `https://api.pagekit.cc/v1` | API base URL |
| `timeout` | `float` | No | `30` | Request timeout in seconds |
| `headers` | `dict` | No | `{}` | Additional headers for all requests |

---

## API Reference

### Posts

#### `client.posts.list(params?)`

List posts with pagination and filtering.

```python
page = client.posts.list(
    status="published",        # "published" | "draft"
    sort="-published_at",      # Sort by field, prefix with "-" for descending
    page=1,                    # Page number
    limit=20,                  # Items per page
    author="author-id",        # Filter by author
    tag="engineering",         # Filter by tag
    category="tutorials",      # Filter by category
    search="nextjs",           # Full-text search
)

for post in page.data:
    print(post.title)
```

**Returns:** `Paginated[Post]`

---

#### `client.posts.get(post_id)`

Get a single post by ID.

```python
post = client.posts.get("post-id")
print(post.title, post.content)
```

**Returns:** `Post`

---

#### `client.posts.get_by_slug(slug)`

Get a single post by slug.

```python
post = client.posts.get_by_slug("my-first-post")
```

**Returns:** `Post`

---

#### `client.posts.create(input)`

Create a new post.

```python
post = client.posts.create(
    title="My Post",
    content="# Title\n\nContent...",
    status="published",
    excerpt="A short summary",
    slug="my-post",
    author="author-id",
    tags=["tag-id-1", "tag-id-2"],
    categories=["category-id"],
    seo={
        "title": "Custom SEO Title",
        "description": "Custom description",
    },
)
```

**Returns:** `Post`

---

#### `client.posts.update(post_id, input)`

Update an existing post. Only include fields you want to change.

```python
updated = client.posts.update(
    "post-id",
    title="Updated Title",
    status="draft",
)
```

**Returns:** `Post`

---

#### `client.posts.delete(post_id)`

Delete a post permanently.

```python
client.posts.delete("post-id")
```

**Returns:** `None`

---

### Authors

#### `client.authors.list(params?)`

List all authors.

```python
page = client.authors.list()
for author in page.data:
    print(author.name)
```

**Returns:** `Paginated[Author]`

---

#### `client.authors.get(author_id)`

Get a single author by ID.

```python
author = client.authors.get("author-id")
```

**Returns:** `Author`

---

### Categories

#### `client.categories.list(params?)`

List all categories.

```python
page = client.categories.list()
for category in page.data:
    print(category.name)
```

**Returns:** `Paginated[Category]`

---

#### `client.categories.get_by_slug(slug)`

Get a single category by slug.

```python
category = client.categories.get_by_slug("engineering")
```

**Returns:** `Category`

---

### Tags

#### `client.tags.list(params?)`

List all tags.

```python
page = client.tags.list()
for tag in page.data:
    print(tag.name)
```

**Returns:** `Paginated[Tag]`

---

### Media

#### `client.media.list(params?)`

List all media assets.

```python
page = client.media.list()
for asset in page.data:
    print(asset.filename, asset.url)
```

**Returns:** `Paginated[Media]`

---

#### `client.media.create(input)`

Register a new media asset.

```python
media = client.media.create(
    url="https://example.com/image.png",
    filename="image.png",
    mime_type="image/png",
    size=1024,
    alt="Descriptive alt text",
)
```

**Returns:** `Media`

---

#### `client.media.delete(media_id)`

Delete a media asset.

```python
client.media.delete("media-id")
```

**Returns:** `None`

---

## Types

The client uses Pydantic models for all data types:

```python
from pagekit import Post, Author, Category, Tag, Media

# All models are accessible for type hints
def process_post(post: Post) -> None:
    print(post.title, post.status)
```

---

## Error Handling

```python
from pagekit import Pagekit, PagekitError

client = Pagekit(api_key="pk_live_...")

try:
    post = client.posts.get("nonexistent-id")
except PagekitError as e:
    print(e.status)         # 404
    print(e.code)           # "not_found"
    print(e.message)        # Human-readable message

    # Convenience properties
    if e.is_auth_error:
        print("Invalid API key (401/403)")
    if e.is_rate_limited:
        print("Rate limited — retry after delay (429)")
    if e.is_server_error:
        print("Server error — safe to retry (5xx)")
```

### Error Properties

| Property | Type | Description |
|----------|------|-------------|
| `status` | `int` | HTTP status code |
| `code` | `str` | Machine-readable error code |
| `message` | `str` | Human-readable error message |
| `is_auth_error` | `bool` | `True` for 401/403 errors |
| `is_rate_limited` | `bool` | `True` for 429 errors |
| `is_server_error` | `bool` | `True` for 5xx errors |

---

## Framework Integrations

### FastAPI

```python
from fastapi import FastAPI, Depends
from pagekit import Pagekit, AsyncPagekit

app = FastAPI()

def get_pagekit():
    return AsyncPagekit(api_key="pk_live_...")

@app.get("/posts")
async def list_posts(pagekit: AsyncPagekit = Depends(get_pagekit)):
    posts = await pagekit.posts.list(status="published")
    return posts.data

@app.get("/posts/{slug}")
async def get_post(slug: str, pagekit: AsyncPagekit = Depends(get_pagekit)):
    post = await pagekit.posts.get_by_slug(slug)
    return post
```

### Django

```python
# views.py
from django.http import JsonResponse
from pagekit import Pagekit

client = Pagekit(api_key="pk_live_...")

def blog_list(request):
    page = client.posts.list(status="published")
    return JsonResponse({"posts": [p.model_dump() for p in page.data]})
```

### Flask

```python
from flask import Flask, jsonify
from pagekit import Pagekit

app = Flask(__name__)
client = Pagekit(api_key="pk_live_...")

@app.route("/api/posts")
def posts():
    page = client.posts.list(status="published")
    return jsonify([p.model_dump() for p in page.data])
```

---

## Development

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install with dev dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Run tests with coverage
pytest --cov=src/pagekit

# Type check (requires mypy)
mypy src

# Format code (requires black)
black src tests
```

---

## Supported Python Versions

- Python 3.10
- Python 3.11
- Python 3.12
- Python 3.13

---

## Related Packages

- [@arovi/pagekit-core](../pagekit-typescript) — TypeScript SDK
- [@arovi/pagekit-mcp](../pagekit-mcp) — MCP server for AI agents
- [@arovi/pagekit-next](../pagekit-next) — Next.js integration
- [@arovi/pagekit-cli](../pagekit-cli) — CLI tooling

---

## License

MIT © [Arovi Labs](https://github.com/arovi-labs)
