#!/usr/bin/env node
/**
 * Smoke-test every PageKit MCP tool against the live API.
 * Usage: PAGEKIT_API_KEY=pk_... PAGEKIT_API_URL=http://localhost:4783/api/v1 node scripts/smoke-test.mjs
 */

import { spawn } from "node:child_process";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MCP_BIN = resolve(__dirname, "../dist/index.js");
const API_KEY = process.env.PAGEKIT_API_KEY ?? "";
const API_URL = process.env.PAGEKIT_API_URL ?? "http://localhost:4783/api/v1";

if (!API_KEY) {
  console.error("PAGEKIT_API_KEY required");
  process.exit(1);
}

const created = { postId: null, authorId: null, mediaId: null };

async function call(client, name, args = {}) {
  const res = await client.callTool({ name, arguments: args });
  const text = res.content?.find((c) => c.type === "text")?.text ?? "";
  const failed = res.isError || text.startsWith("Error");
  return { failed, text: text.slice(0, 200) };
}

async function main() {
  const transport = new StdioClientTransport({
    command: "node",
    args: [MCP_BIN],
    env: { ...process.env, PAGEKIT_API_KEY: API_KEY, PAGEKIT_API_URL: API_URL },
  });

  const client = new Client({ name: "mcp-smoke-test", version: "1.0.0" });
  await client.connect(transport);

  const tools = await client.listTools();
  console.log(`\n📋 ${tools.tools.length} MCP tools registered\n`);

  const results = [];

  const run = async (name, args, label = name) => {
    try {
      const { failed, text } = await call(client, name, args);
      results.push({ label, ok: !failed, detail: failed ? text : "OK" });
      console.log(`${failed ? "❌" : "✅"} ${label}${failed ? `\n   ${text.split("\n")[0]}` : ""}`);
      return !failed;
    } catch (e) {
      results.push({ label, ok: false, detail: e.message });
      console.log(`❌ ${label}\n   ${e.message}`);
      return false;
    }
  };

  // ── Read-only ─────────────────────────────────────────────────────────
  await run("pagekit_health");
  await run("pagekit_project_info");
  await run("pagekit_list_posts", { limit: 5 });
  await run("pagekit_list_tags");
  await run("pagekit_list_categories");
  await run("pagekit_list_authors", { limit: 10 });
  await run("pagekit_list_media", { limit: 5 });

  // ── Create author ─────────────────────────────────────────────────────
  const authorRes = await client.callTool({
    name: "pagekit_create_author",
    arguments: { name: "MCP Smoke Test", bio: "Auto-created by smoke test", email: "mcp-test@pagekit.local" },
  });
  const authorText = authorRes.content?.[0]?.text ?? "";
  const authorMatch = authorText.match(/"id"\s*:\s*"([^"]+)"/) ?? authorText.match(/`([^`]+)`/);
  created.authorId = authorMatch?.[1] ?? null;
  const authorOk = !authorRes.isError && created.authorId;
  results.push({ label: "pagekit_create_author", ok: authorOk, detail: authorOk ? created.authorId : authorText.slice(0, 120) });
  console.log(`${authorOk ? "✅" : "❌"} pagekit_create_author`);

  if (created.authorId) {
    await run("pagekit_get_author", { id: created.authorId });
  }

  // ── Create post ─────────────────────────────────────────────────────────
  const postRes = await client.callTool({
    name: "pagekit_create_post",
    arguments: {
      title: `MCP Smoke Test ${Date.now()}`,
      content: "# Smoke test\n\nCreated via MCP smoke test.",
      status: "draft",
      tags: ["mcp-test"],
    },
  });
  const postText = postRes.content?.[0]?.text ?? "";
  const postMatch = postText.match(/"id"\s*:\s*"([^"]+)"/);
  created.postId = postMatch?.[1] ?? null;
  const postOk = !postRes.isError && created.postId;
  results.push({ label: "pagekit_create_post", ok: postOk, detail: postOk ? created.postId : postText.slice(0, 120) });
  console.log(`${postOk ? "✅" : "❌"} pagekit_create_post`);

  if (created.postId) {
    await run("pagekit_get_post", { id: created.postId });
    await run("pagekit_update_post", { id: created.postId, excerpt: "Updated by MCP smoke test" });
    await run("pagekit_delete_post", { id: created.postId });
    created.postId = null;
  }

  // ── Create media ────────────────────────────────────────────────────────
  const mediaRes = await client.callTool({
    name: "pagekit_create_media",
    arguments: {
      url: "https://example.com/mcp-smoke-test.png",
      filename: "mcp-smoke-test.png",
      mimeType: "image/png",
      size: 1024,
      alt: "MCP smoke test",
    },
  });
  const mediaText = mediaRes.content?.[0]?.text ?? "";
  const mediaMatch = mediaText.match(/"id"\s*:\s*"([^"]+)"/) ?? mediaText.match(/`([^`]+)`/);
  created.mediaId = mediaMatch?.[1] ?? null;
  const mediaOk = !mediaRes.isError && created.mediaId;
  results.push({ label: "pagekit_create_media", ok: mediaOk, detail: mediaOk ? created.mediaId : mediaText.slice(0, 120) });
  console.log(`${mediaOk ? "✅" : "❌"} pagekit_create_media`);

  if (created.authorId) {
    await run("pagekit_update_author", { id: created.authorId, bio: "Updated by MCP smoke test" });
  }

  // ── Cleanup (delete) ────────────────────────────────────────────────────
  if (created.mediaId) await run("pagekit_delete_media", { id: created.mediaId });

  await client.close();

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);
  console.log(`\n── Summary: ${passed}/${results.length} passed ──`);
  if (failed.length) {
    console.log("\nFailed:");
    for (const f of failed) console.log(`  • ${f.label}: ${f.detail?.split("\n")[0]}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
