#!/usr/bin/env node

import { Command } from "commander";
import prompts from "prompts";
import { execSync } from "node:child_process";
import { existsSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const program = new Command();

program
  .name("pagekit")
  .description("CLI for PageKit — the content layer for your website")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize PageKit in your project")
  .action(async () => {
    console.log();

    // Detect framework
    const framework = detectFramework();
    if (framework) {
      console.log(`  ✓ ${framework} detected`);
    }

    // Ask what they're building
    const { projectType } = await prompts({
      type: "select",
      name: "projectType",
      message: "What are you building?",
      choices: [
        { title: "Blog", value: "blog" },
        { title: "Changelog", value: "changelog" },
        { title: "Docs", value: "docs" },
        { title: "Marketing site", value: "marketing" },
        { title: "Custom", value: "custom" },
      ],
    });

    if (!projectType) {
      console.log("\n  Cancelled.\n");
      process.exit(0);
    }

    // Check for existing .env.local
    const envPath = join(process.cwd(), ".env.local");
    const envExists = existsSync(envPath);

    if (envExists) {
      const envContent = readFileSync(envPath, "utf-8");
      if (envContent.includes("PAGEKIT_API_KEY")) {
        console.log("  ✓ PAGEKIT_API_KEY already configured");
      } else {
        appendEnvKey(envPath);
        console.log("  ✓ Added PAGEKIT_API_KEY to .env.local");
      }
    } else {
      writeFileSync(envPath, "PAGEKIT_API_KEY=\n");
      console.log("  ✓ Created .env.local with PAGEKIT_API_KEY");
    }

    // Install SDK if not already installed
    const pkgPath = join(process.cwd(), "package.json");
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (!allDeps["@arovi/pagekit-core"]) {
        const useYarn = existsSync(join(process.cwd(), "yarn.lock"));
        const usePnpm = existsSync(join(process.cwd(), "pnpm-lock.yaml"));
        const cmd = usePnpm ? "pnpm add" : useYarn ? "yarn add" : "npm install";

        console.log(`  Installing @arovi/pagekit-core...`);
        try {
          execSync(`${cmd} @arovi/pagekit-core`, { stdio: "ignore" });
          console.log("  ✓ Installed @arovi/pagekit-core");
        } catch {
          console.log("  ⚠ Could not install automatically. Run:");
          console.log(`    ${cmd} @arovi/pagekit-core`);
        }
      } else {
        console.log("  ✓ @arovi/pagekit-core already installed");
      }
    }

    // Summary
    console.log();
    console.log("  PageKit configured.");
    console.log();
    console.log("  Next steps:");
    console.log("    1. Get your API key from your PageKit dashboard");
    console.log("    2. Set PAGEKIT_API_KEY in .env.local");
    console.log("    3. Start building:");
    console.log();
    console.log("       import { Pagekit } from '@arovi/pagekit-core';");
    console.log();
    console.log("       const pagekit = new Pagekit({");
    console.log("         apiKey: process.env.PAGEKIT_API_KEY,");
    console.log("       });");
    console.log();
  });

function detectFramework(): string | null {
  const cwd = process.cwd();

  if (existsSync(join(cwd, "next.config.js")) || existsSync(join(cwd, "next.config.mjs")) || existsSync(join(cwd, "next.config.ts"))) {
    return "Next.js";
  }
  if (existsSync(join(cwd, "astro.config.mjs")) || existsSync(join(cwd, "astro.config.ts"))) {
    return "Astro";
  }
  if (existsSync(join(cwd, "nuxt.config.ts")) || existsSync(join(cwd, "nuxt.config.js"))) {
    return "Nuxt";
  }
  if (existsSync(join(cwd, "svelte.config.js")) || existsSync(join(cwd, "svelte.config.ts"))) {
    return "SvelteKit";
  }
  if (existsSync(join(cwd, "vite.config.ts")) || existsSync(join(cwd, "vite.config.js"))) {
    return "Vite";
  }
  if (existsSync(join(cwd, "remix.config.js")) || existsSync(join(cwd, "remix.config.ts"))) {
    return "Remix";
  }
  if (existsSync(join(cwd, "gatsby-config.js")) || existsSync(join(cwd, "gatsby-config.ts"))) {
    return "Gatsby";
  }

  return null;
}

function appendEnvKey(path: string): void {
  const content = readFileSync(path, "utf-8");
  const separator = content.endsWith("\n") ? "" : "\n";
  writeFileSync(path, content + separator + "PAGEKIT_API_KEY=\n");
}

program.parse();
