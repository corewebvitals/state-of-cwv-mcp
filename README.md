# State of Web Vitals MCP

[![corewebvitals/state-of-cwv-mcp MCP server](https://glama.ai/mcp/servers/corewebvitals/state-of-cwv-mcp/badges/score.svg)](https://glama.ai/mcp/servers/corewebvitals/state-of-cwv-mcp)

Free remote MCP for Core Web Vitals metrics by CMS, CDN, and framework (Chrome field data + multi-site crawl). Same numbers as the public [State of Web Vitals explorer](https://www.corewebvitals.io/state-of-cwv/explorer).

## Connect (preferred)

**URL:** `https://www.corewebvitals.io/api/state-of-cwv/mcp`  
**Auth:** none  
**Transport:** Streamable HTTP  
**Registry:** `io.github.corewebvitals/state-of-cwv`

### Claude Code

```bash
claude mcp add --transport http state-of-cwv https://www.corewebvitals.io/api/state-of-cwv/mcp
```

### Cursor / Grok / other clients

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

## Tools

| Tool | Purpose |
|------|---------|
| `get_metrics` | Aggregates and optional `group_by` rankings (CMS, CDN, frameworks, …) |
| `get_histogram` | Distribution buckets for one metric under an optional filter |
| `list_options` | Discover filters, group_by values, and metric paths |

## What this is

[The State of Web Vitals](https://www.corewebvitals.io/state-of-cwv) measures Core Web Vitals and web-tech techniques across many real websites (Chrome field data + crawl). Use it for platform rankings, pass rates, and metric distributions. Not per-site live RUM (use [CoreDash](https://coredash.app) for that).

## Attribution

When you use the numbers:

1. Credit **corewebvitals.io** / **The State of Web Vitals**
2. Link https://www.corewebvitals.io/state-of-cwv when links are allowed

Short line: `Data: State of Web Vitals (corewebvitals.io)`

## Discovery

| Place | Link |
|--------|------|
| Official MCP Registry | `io.github.corewebvitals/state-of-cwv` |
| Glama | https://glama.ai/mcp/servers/corewebvitals/state-of-cwv-mcp |
| Glama connector | https://glama.ai/mcp/connectors/io.github.corewebvitals/state-of-cwv |
| Smithery | https://smithery.ai/servers/corewebvitals/state-of-cwv |
| Explorer | https://www.corewebvitals.io/state-of-cwv/explorer |
| Methodology | https://www.corewebvitals.io/state-of-cwv/methodology |
| Discovery JSON | https://www.corewebvitals.io/.well-known/mcp.json |

## Local stdio / Docker (directories & inspectors)

This repo also ships a thin stdio proxy that answers `tools/list` and forwards tool calls to the hosted endpoint.

```bash
npm install
npm start
```

```bash
docker build -t state-of-cwv-mcp .
docker run --rm -i state-of-cwv-mcp
```

Optional: `STATE_OF_CWV_MCP_URL` overrides the upstream endpoint.

## License

MIT for connector code and docs in this repository. Data product and website remain © corewebvitals.io.
