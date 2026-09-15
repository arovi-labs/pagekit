# pagekit

Python client for the [Pagekit](https://pagekit.cc) content API.

## Installation

```bash
pip install pagekit-core
```

## Quick start

```python
from pagekit import Pagekit

client = Pagekit(api_key="pk_live_...")

# List posts
page = client.posts.list(status="published", limit=10)
for post in page.data:
    print(post.title)

# Create a post
post = client.posts.create(title="Hello world", content="<p>First post</p>")

# Get by slug
post = client.posts.get_by_slug("hello-world")
```

## Async usage

```python
from pagekit import AsyncPagekit

client = AsyncPagekit(api_key="pk_live_...")

posts = await client.posts.list()
```

## Configuration

```python
client = Pagekit(
    api_key="pk_live_...",
    base_url="https://api.pagekit.cc/v1",  # default
    timeout=30,                               # seconds
    headers={"X-Custom": "value"},            # extra headers
)
```

## Error handling

```python
from pagekit import Pagekit, PagekitError

client = Pagekit(api_key="pk_live_...")

try:
    post = client.posts.get("nonexistent")
except PagekitError as e:
    print(e.status)   # 404
    print(e.code)     # "not_found"
    print(e.is_auth_error)      # False
    print(e.is_rate_limited)    # False
    print(e.is_server_error)    # False
```

## License

MIT
