# Builds and runs the State of Web Vitals MCP stdio server.
# Used by MCP hosts/inspectors (e.g. Glama) that verify the server starts
# and responds to introspection. No env vars required; proxies the public
# hosted endpoint https://www.corewebvitals.io/api/state-of-cwv/mcp
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
COPY src ./src

RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

ENV STATE_OF_CWV_MCP_URL=https://www.corewebvitals.io/api/state-of-cwv/mcp

CMD ["node", "src/index.js"]
