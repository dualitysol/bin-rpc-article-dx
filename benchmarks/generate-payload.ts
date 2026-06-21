/**
 * Generate a binary payload for benchmarking.
 *
 * Uses the generated @layra/rpc binary layout to produce
 * a request body that the binary server can read.
 *
 * Usage:
 *   npx tsx benchmarks/generate-payload.ts
 *   # Creates create-user-body.bin in project root
 */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SIZE,
  writeToBuffer,
} from '../src/examples/generated/user.dto.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const buf = Buffer.alloc(SIZE);
writeToBuffer(
  buf,
  'John',
  'Doe',
  33,
  'john@doe.com',
  'm',
  '123456',
  true,
);

const outputPath = join(__dirname, '..', 'create-user-body.bin');
writeFileSync(outputPath, buf);

console.log(`✅ Payload written: ${outputPath}`);
console.log(`   Size: ${buf.length} bytes`);
console.log(`   Fields: firstName="John", lastName="Doe", age=33, email="john@doe.com"`);
