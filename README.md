# State of Web Vitals MCP

Free remote MCP for Core Web Vitals and technique metrics from Chrome field data plus a multi-site crawl. Same numbers as the public [State of Web Vitals explorer](https://www.corewebvitals.io/state-of-cwv/explorer).

Hosted endpoint: `https://www.corewebvitals.io/api/state-of-cwv/mcp`  
Registry: `io.github.corewebvitals/state-of-cwv`  
No install, no API key.

This repo holds the public connector docs and registry manifest. You connect your MCP client directly to the hosted endpoint.

## What this is

[The State of Web Vitals](https://www.corewebvitals.io/state-of-cwv) measures Core Web Vitals and web-tech techniques across many real websites (Chrome field data + crawl). Use it for platform rankings (CMS, CDN, frameworks), pass rates, and metric distributions — not per-site live RUM. For live per-site RUM, use [CoreDash](https://coredash.app).

## Tools

| Tool | Purpose |
|------|---------|
| `get_metrics` | Aggregates and optional `group_by` rankings (CMS, CDN, frameworks, …) |
| `get_histogram` | Distribution buckets for one metric under an optional filter |
| `list_options` | Discover filters, group_by values, and metric paths |

## Authentication

None. Public research data. Credit [corewebvitals.io](https://www.corewebvitals.io/state-of-cwv) when you use the numbers.

## Connecting

### Claude Code

```bash
claude mcp add --transport http state-of-cwv https://www.corewebvitals.io/api/state-of-cwv/mcp
```

### Cursor / Grok / clients

```json
{
  "mcpServers": {
    "state-of-cwv": {
      "type": "http",
      "url": "https://www.corewebvitals.io/api/state-of-cwv/mcp"
    }
  }
}
```

### Curl

```bash
curl -s -X POST https://www.corewebvitals.io/api/state-of-cwv/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_metrics","arguments":{"metrics":"lcp,good_all3","group_by":"cms","min_sites":100}}}'
```

## Attribution

When quoting or basing conclusions on this data:

1. Credit **corewebvitals.io** / **The State of Web Vitals**
2. Link **https://www.corewebvitals.io/state-of-cwv** when links are allowed

Short line: `Data: State of Web Vitals (corewebvitals.io)`

## Links

- Explorer: https://www.corewebvitals.io/state-of-cwv/explorer
- Methodology: https://www.corewebvitals.io/state-of-cwv/methodology
- Discovery: https://www.corewebvitals.io/.well-known/mcp.json
- Official MCP Registry: search `io.github.corewebvitals/state-of-cwv`

## License

Documentation in this repository is MIT. The data product and website remain © corewebvitals.io.
