#!/usr/bin/env node

/**
 * Synpress cache hash 同步脚本
 *
 * Synpress CLI 和 Playwright test runner 使用不同的编译器，
 * 导致 defineWalletSetup 对同一个函数计算出不同的 hash。
 *
 * 本脚本：运行一次 playwright test（会因缺少 cache 而失败），
 * 从报错中提取 Playwright 期望的 hash，然后复制真实缓存到该 hash 目录。
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const CACHE_DIR = path.resolve(process.cwd(), ".cache-synpress");

if (!fs.existsSync(CACHE_DIR)) {
  console.error("❌ .cache-synpress 目录不存在，请先运行 pnpm run test:e2e:cache");
  process.exit(1);
}

// 找到真实缓存目录（排除 metamask- 开头和 .zip 文件）
const entries = fs.readdirSync(CACHE_DIR).filter((entry) => {
  if (entry.startsWith("metamask")) return false;
  if (entry.endsWith(".zip")) return false;
  const stat = fs.statSync(path.join(CACHE_DIR, entry));
  return stat.isDirectory();
});

if (entries.length === 0) {
  console.error("❌ 没有找到缓存目录，请先运行 pnpm run test:e2e:cache");
  process.exit(1);
}

const realCacheHash = entries[0];
console.log(`✅ CLI 生成的缓存: ${realCacheHash}`);

// 尝试运行 playwright test，如果因 cache hash 不匹配而失败，提取期望的 hash
let output = "";
try {
  output = execSync("npx playwright test --reporter=line 2>&1", {
    encoding: "utf-8",
    timeout: 30000,
  });
  // 如果成功了，说明 hash 已经匹配
  console.log("✅ 测试可正常启动，hash 已匹配");
  process.exit(0);
} catch (e) {
  output = (e.stdout || "") + (e.stderr || "") + (e.message || "");
}

// 从报错信息中提取 "Cache for XXXX does not exist"
const match = output.match(/Cache for ([a-f0-9]+) does not exist/);
if (!match) {
  // 不是 hash mismatch 错误，可能是其他问题，跳过
  console.log("⚠️ 未检测到 cache hash 不匹配错误，跳过同步");
  process.exit(0);
}

const expectedHash = match[1];
console.log(`✅ Playwright 期望的 hash: ${expectedHash}`);

if (entries.includes(expectedHash)) {
  console.log("✅ 目标缓存已存在，无需同步");
  process.exit(0);
}

// 复制缓存
const sourcePath = path.join(CACHE_DIR, realCacheHash);
const targetPath = path.join(CACHE_DIR, expectedHash);
fs.cpSync(sourcePath, targetPath, { recursive: true });
console.log(`✅ 已同步缓存: ${realCacheHash} → ${expectedHash}`);
