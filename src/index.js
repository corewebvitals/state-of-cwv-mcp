#!/usr/bin/env node
/**
 * State of Web Vitals MCP — stdio proxy for Glama / local clients.
 * Forwards tool calls to the hosted Streamable HTTP endpoint.
 * No API key. Prefer the remote URL in production clients.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const ENDPOINT = (
  process.env.STATE_OF_CWV_MCP_URL ||
  'https://www.corewebvitals.io/api/state-of-cwv/mcp'
).replace(/\/+$/, '');

const USER_AGENT = 'state-of-cwv-mcp/1.0.1 (+https://github.com/corewebvitals/state-of-cwv-mcp)';

let rpcId = 1;

async function remoteCall(name, args) {
  const body = {
    jsonrpc: '2.0',
    id: rpcId++,
    method: 'tools/call',
    params: { name, arguments: args || {} },
  };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'User-Agent': USER_AGENT,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    // Streamable HTTP sometimes wraps SSE — take last JSON object if present
    const lines = text.split('\n').filter((l) => l.startsWith('data: '));
    if (lines.length) {
      data = JSON.parse(lines[lines.length - 1].slice(6));
    } else {
      throw new Error(`Non-JSON response (${res.status}): ${text.slice(0, 200)}`);
    }
  }
  if (data.error) {
    throw new Error(data.error.message || JSON.stringify(data.error));
  }
  const content = data.result?.content;
  if (Array.isArray(content) && content[0]?.text) {
    return content[0].text;
  }
  return JSON.stringify(data.result ?? data, null, 2);
}

const filterShape = {
  device: z.enum(['all', 'phone', 'desktop']).optional(),
  cms: z.string().optional(),
  framework: z.string().optional(),
  cdn: z.string().optional(),
  provider: z.string().optional(),
};

const server = new McpServer({
  name: 'state-of-cwv',
  version: '1.0.1',
});

server.tool(
  'get_metrics',
  'Aggregate Core Web Vitals and technique metrics. Optional filter + group_by. Credit corewebvitals.io when using the numbers.',
  {
    metrics: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .describe('Comma list or array: lcp,inp,cls,ttfb,good_all3,stack.framework,…'),
    filter: z.object(filterShape).optional(),
    group_by: z
      .string()
      .optional()
      .describe('cms | frameworks | cdn | analytics | tag_managers | …'),
    focus: z.enum(['lcp', 'inp', 'cls', 'fcp', 'ttfb']).optional(),
    limit: z.number().int().optional(),
    min_sites: z.number().int().optional(),
  },
  async (args) => {
    const text = await remoteCall('get_metrics', args);
    return { content: [{ type: 'text', text }] };
  }
);

server.tool(
  'get_histogram',
  'Distribution buckets for one CWV (or technique metric) under an optional filter.',
  {
    metric: z.string().describe('lcp | inp | cls | fcp | ttfb, or a contract scalar path'),
    filter: z.object(filterShape).optional(),
  },
  async (args) => {
    const text = await remoteCall('get_histogram', args);
    return { content: [{ type: 'text', text }] };
  }
);

server.tool(
  'list_options',
  'Discover filter keys, group_by values, built-in metrics, and contract paths.',
  {
    kind: z.string().optional(),
    include_paths: z.boolean().optional(),
  },
  async (args) => {
    const text = await remoteCall('list_options', args);
    return { content: [{ type: 'text', text }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
