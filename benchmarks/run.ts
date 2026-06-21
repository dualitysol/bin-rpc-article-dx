/**
 * Benchmark runner — @layra/rpc DX Framework Demo
 *
 * Tests both binary and JSON servers sequentially (one at a time).
 *
 * Usage:
 *   npx tsx benchmarks/run.ts              # binary only
 *   npx tsx benchmarks/run.ts --both       # binary + fastify
 *   npx tsx benchmarks/run.ts --fastify    # fastify only
 */

import autocannon from 'autocannon';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const RESULTS_DIR = join(ROOT, 'results');

const PAYLOAD_BIN = join(ROOT, 'create-user-body.bin');
const PAYLOAD_JSON = JSON.stringify({
  firstName: 'John',
  lastName: 'Doe',
  age: 33,
  email: 'john@doe.com',
  sex: 'm',
  password: '123456',
  active: true,
});

const args = process.argv.slice(2);
const isCI = args.includes('--ci');
const CONNECTIONS = isCI ? 50 : 100;
const DURATION = isCI ? 5 : 15;

// ── Helpers ───────────────────────────────────────────────────

function runBenchmark(opts: {
  url: string;
  body: string | Buffer;
  headers?: Record<string, string>;
}): Promise<autocannon.Result> {
  return new Promise((resolve, reject) => {
    const instance = autocannon({
      url: opts.url,
      connections: CONNECTIONS,
      duration: DURATION,
      method: 'POST',
      body: opts.body,
      headers: opts.headers || {},
    }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    autocannon.track(instance, { renderProgressBar: true, renderResultsTable: false });
  });
}

function formatResults(name: string, result: autocannon.Result): void {
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log(`  ${name}`);
  console.log('═══════════════════════════════════════════════');
  console.log(`  Requests:       ${result.requests.total.toLocaleString()} in ${result.duration.toFixed(1)}s`);
  console.log(`  RPS (avg):      ${result.requests.average.toLocaleString()}`);
  console.log(`  RPS (max):      ${result.requests.max.toLocaleString()}`);
  console.log(`  Latency (avg):  ${result.latency.average.toFixed(2)} ms`);
  console.log(`  Latency (p99):  ${result.latency.p99.toFixed(2)} ms`);
  console.log(`  Latency (max):  ${result.latency.max} ms`);
  console.log(`  Throughput:     ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/s`);
  console.log(`  2xx:            ${result['2xx'] || 0}`);
  console.log(`  Non-2xx:        ${result['non2xx'] || 0}`);
  console.log('');
}

function saveResults(name: string, result: autocannon.Result): void {
  if (!existsSync(RESULTS_DIR)) {
    mkdirSync(RESULTS_DIR, { recursive: true });
  }
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const f = `${name.replace(/[^a-z0-9]/gi, '_')}_${ts}.json`;
  writeFileSync(join(RESULTS_DIR, f), JSON.stringify(result, null, 2));
  console.log(`  Results saved: results/${f}`);
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  const mode = args.includes('--both') ? 'both'
    : args.includes('--fastify') ? 'fastify'
    : 'binary';

  if (!existsSync(PAYLOAD_BIN)) {
    console.log('Generating binary payload...');
    // Dynamic import — run the payload generator
    await import('./generate-payload.js');
  }

  const binaryBody = readFileSync(PAYLOAD_BIN);

  if (mode === 'binary' || mode === 'both') {
    console.log(`\n🔥 Benchmark: @layra/rpc Binary Server`);
    console.log(`   ${CONNECTIONS} connections, ${DURATION}s duration`);
    try {
      const r = await runBenchmark({
        url: 'http://localhost:3001',
        body: binaryBody,
        headers: { 'Content-Type': 'application/octet-stream' },
      });
      formatResults('@layra/rpc BINARY', r);
      saveResults('layra_binary', r);
    } catch (err: any) {
      console.error('❌ Binary benchmark failed:', err.message);
    }
  }

  if (mode === 'fastify' || mode === 'both') {
    console.log(`\n🔥 Benchmark: Fastify (JSON baseline)`);
    console.log(`   ${CONNECTIONS} connections, ${DURATION}s duration`);
    try {
      const r = await runBenchmark({
        url: 'http://localhost:3002',
        body: PAYLOAD_JSON,
        headers: { 'Content-Type': 'application/json' },
      });
      formatResults('FASTIFY / JSON', r);
      saveResults('fastify_json', r);
    } catch (err: any) {
      console.error('❌ Fastify benchmark failed:', err.message);
    }
  }

  // ── Summary ─────────────────────────────────────────────
  if (mode === 'both') {
    console.log('\n═══════════════════════════════════════════════');
    console.log('  📊 COMPARISON SUMMARY');
    console.log('═══════════════════════════════════════════════');
    console.log('  Results saved in results/');
    console.log('  Run benchmark/generate-report.ts for HTML report');
  }
}

main().catch(console.error);
