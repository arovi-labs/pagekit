import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PagekitClient } from "../client.js";
import { registerAuthorTools } from "./authors.js";
import { registerPostTools } from "./posts.js";
import { registerTaxonomyTools } from "./taxonomy.js";
import { registerMediaTools } from "./media.js";
import { registerProjectTools } from "./project.js";

export function registerAllTools(server: McpServer, client: PagekitClient) {
  registerPostTools(server, client);
  registerTaxonomyTools(server, client);
  registerAuthorTools(server, client);
  registerMediaTools(server, client);
  registerProjectTools(server, client);
}
