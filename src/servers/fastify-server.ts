/**
 * Fastify Server — Standard JSON baseline for comparison.
 *
 * Same business logic as the binary server, but uses JSON
 * serialization. Every request triggers:
 *   - JSON.parse (allocates strings, numbers, objects)
 *   - Response object allocation
 *   - JSON.stringify (template strings + serialisation)
 *
 * Usage:
 *   npx tsx src/servers/fastify-server.ts
 *   autocannon -c 100 -d 15 -m POST -b '{"firstName":"John","lastName":"Doe","age":33,"email":"john@doe.com","sex":"m","password":"123456","active":true}' -H "Content-Type: application/json" http://localhost:3002
 */

import fastify from 'fastify';

const PORT = parseInt(process.env.PORT ?? '3002', 10);

const app = fastify();

// ── Routes ────────────────────────────────────────────────────

app.get('/health', async () => {
  return { status: 'ok' };
});

app.post('/', async (request) => {
  const body = request.body as Record<string, any>;
  const { firstName, lastName, email, password } = body;

  // Same anti-caching shuffle as binary server
  const order = [0, 1, 2, 3];
  let state = Date.now();
  for (let i = order.length - 1; i > 0; i--) {
    state = (state * 48271) % 2147483647;
    const j = state % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  const fields = [firstName, lastName, email, password];
  const message =
    fields[order[0]] + fields[order[1]] + fields[order[2]] + fields[order[3]];

  return {
    success: true,
    message,
  };
});

// ── Start ─────────────────────────────────────────────────────

const start = async () => {
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`╔══════════════════════════════════════════════════════════════╗`);
    console.log(`║  🔥 Fastify Server (JSON baseline)                         ║`);
    console.log(`╠══════════════════════════════════════════════════════════════╣`);
    console.log(`║  Listening:     http://localhost:${PORT}                        ║`);
    console.log(`║  Framework:     fastify@5 + JSON                            ║`);
    console.log(`║  Payload:      ${JSON.stringify({
      firstName: 'John', lastName: 'Doe', age: 33,
      email: 'john@doe.com', sex: 'm', password: '123456', active: true,
    })}`);
    console.log(`╚══════════════════════════════════════════════════════════════╝`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
