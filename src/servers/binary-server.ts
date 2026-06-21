/**
 * Binary Server — @layra/rpc UseCase + DtoPool
 *
 * ── Architecture ──────────────────────────────────────────────
 *
 *   ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
 *   │  HTTP POST   │ ──→ │  DtoPool.acquire│ ──→ │  UseCase     │
 *   │  raw binary  │     │  (zero alloc)   │     │  .handle()   │
 *   └──────────────┘     └─────────────────┘     └──────┬───────┘
 *                                                        │
 *   ┌──────────────┐     ┌─────────────────┐            │
 *   │  HTTP 200    │ ←── │  writeToBuffer  │ ←──────────┘
 *   │  binary body │     │  (pooled buf)   │
 *   └──────────────┘     └─────────────────┘
 *
 * ── What the developer wrote ─────────────────────────────────
 *
 *   const uc = new CreateUserUseCase();
 *   const result = uc.handle(dto);
 *   writeToBuffer(resBuf, ...result.__responseArgs);
 *
 * ── What the runtime does ────────────────────────────────────
 *   - DtoPool pre-creates N buffer-backed DTOs at startup
 *   - reqItem.dto is a generated binary view (proxy with getters)
 *   - .firstName / .lastName / .email / .password read from buffer
 *   - response buffer is pre-allocated, writeToBuffer fills it
 *   - Zero GC pressure on the hot path
 *
 * ── Usage ────────────────────────────────────────────────────
 *   npx tsx src/servers/binary-server.ts
 *   autocannon -c 100 -d 15 -b ./create-user-body.bin http://localhost:3001
 */

import http from 'node:http';
import { DtoPool } from '@layra/rpc';
import {
  createDTO as createReqDto,
  SIZE as REQ_SIZE,
} from '../examples/generated/user.dto.js';
import {
  createDTO as createResDto,
  SIZE as RES_SIZE,
  writeToBuffer,
} from '../examples/generated/user-created.dto.js';
import { CreateUserUseCase } from '../use-cases/create-user.use-case.js';

// ── Configuration ─────────────────────────────────────────────

const POOL_SIZE = parseInt(process.env.POOL_SIZE ?? '50000', 10);
const PORT = parseInt(process.env.PORT ?? '3001', 10);

// ── Startup — Pre-create all pooled resources ─────────────────

const requestPool  = new DtoPool(createReqDto, REQ_SIZE, POOL_SIZE);
const responsePool = new DtoPool(createResDto, RES_SIZE, POOL_SIZE);
const useCase      = new CreateUserUseCase();

// ── Server ────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  // ── Health check ─────────────────────────────────────────
  if (req.url === '/health' && req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('OK');
    return;
  }

  // ── Only POST / ──────────────────────────────────────────
  if (req.url !== '/' || req.method !== 'POST') {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
    return;
  }

  // ── Acquire pooled DTO + buffer pairs (zero allocation) ──
  const reqItem = requestPool.acquire();
  if (!reqItem) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Service Unavailable: request pool exhausted');
    return;
  }

  const resItem = responsePool.acquire();
  if (!resItem) {
    requestPool.release(reqItem);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Service Unavailable: response pool exhausted');
    return;
  }

  const buf = reqItem.buf;
  let offset = 0;

  // ── Stream incoming data into pre-allocated buffer ───────
  req.on('data', (chunk: Buffer) => {
    const len = Math.min(chunk.length, buf.length - offset);
    chunk.copy(buf, offset, 0, len);
    offset += len;
  });

  req.on('end', () => {
    // 1. Business logic — UseCase reads fields via DTO getters
    const result = useCase.handle(reqItem.dto);

    // 2. Write response into pooled buffer
    writeToBuffer(resItem.buf, ...result.__responseArgs);

    // 3. Send
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/octet-stream');
    res.end(resItem.buf);

    // 4. Return both items to their pools
    requestPool.release(reqItem);
    responsePool.release(resItem);
  });
});

// ── Start ─────────────────────────────────────────────────────

server.listen(PORT, () => {
  console.log(`╔══════════════════════════════════════════════════════════════╗`);
  console.log(`║  🚀 @layra/rpc — Binary Server (UseCase + DtoPool)         ║`);
  console.log(`╠══════════════════════════════════════════════════════════════╣`);
  console.log(`║  Listening:     http://localhost:${PORT}                        ║`);
  console.log(`║  Pool:          ${POOL_SIZE} pre-created DTOs                   ║`);
  console.log(`║  Slot:          ${REQ_SIZE}B req / ${RES_SIZE}B res                ║`);
  console.log(`║  UseCase:       CreateUserUseCase                           ║`);
  console.log(`║  Framework:     native node:http + @layra/rpc               ║`);
  console.log(`║  Zero-alloc:    DTOs created once at startup               ║`);
  console.log(`║                                                             ║`);
  console.log(`║  To benchmark:                                              ║`);
  console.log(`║    autocannon -c 100 -d 15 -m POST                          ║`);
  console.log(`║      -b ./create-user-body.bin                             ║`);
  console.log(`║      http://localhost:${PORT}                                  ║`);
  console.log(`╚══════════════════════════════════════════════════════════════╝`);
});
