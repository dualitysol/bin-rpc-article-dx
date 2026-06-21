/**
 * CreateUser Use Case — Business logic for user registration.
 *
 * ── What the developer wrote ─────────────────────────────────
 *
 *   @Method({ name: 'createUser', payload: CreateUserDto, response: UserCreatedDto })
 *   export class CreateUserUseCase extends UseCase {
 *     handle(dto: CreateUserDto) {
 *       const fields = [dto.firstName, dto.lastName, dto.email, dto.password];
 *       const order = this.shuffledOrder();
 *       const message = fields[order[0]] + fields[order[1]] + fields[order[2]] + fields[order[3]];
 *       return this.response(true, message);
 *     }
 *   }
 *
 * ── What happens at runtime ──────────────────────────────────
 *   The DTO object received by `handle()` is NOT a class instance.
 *   It's a **generated binary view** created by `createDTO(buf)`.
 *
 *   Every getter (`.firstName`, `.lastName`, etc.) reads directly
 *   from a pre-allocated Buffer — zero string allocations.
 *
 *   The developer doesn't need to know. They just write clean,
 *   declarative code with @Dto() / @Field() decorators.
 *
 * ── See also ─────────────────────────────────────────────────
 *   src/examples/user.dto.ts          — DTO declarations
 *   src/examples/generated/user.dto.ts — Generated binary view
 *   src/servers/binary-server.ts       — HTTP server wiring
 */

import { UseCase, Method } from '@layra/rpc';
import { CreateUserDto, UserCreatedDto } from '../examples/user.dto.js';

// ── UseCase ───────────────────────────────────────────────────

@Method({ name: 'createUser', payload: CreateUserDto, response: UserCreatedDto })
export class CreateUserUseCase extends UseCase<CreateUserDto, UserCreatedDto> {
  /**
   * Handle a CreateUser request.
   *
   * Concatenates firstName + lastName + email + password
   * in a random order (anti-caching) to produce a message.
   *
   * @param dto — A CreateUserDto backed by a pre-allocated buffer
   * @returns Response args consumed by the server's writeToBuffer()
   */
  handle(dto: CreateUserDto): ReturnType<UseCase['response']> {
    // 1. Read fields via DTO getters (zero alloc — reads from buffer)
    const fields = [dto.firstName, dto.lastName, dto.email, dto.password];

    // 2. Fisher-Yates shuffle seeded with timestamp
    const order = this.shuffledOrder();
    const message =
      fields[order[0]] + fields[order[1]] + fields[order[2]] + fields[order[3]];

    // 3. Return response args that the server will write into the pooled buffer
    return this.response(true, message);
  }

  /**
   * Fisher-Yates shuffle with Date.now() seed.
   * Produces different concatenation order per millisecond,
   * preventing HTTP response caching (proxies, CDNs, etc.).
   */
  private shuffledOrder(): number[] {
    const order = [0, 1, 2, 3];
    let state = Date.now();
    for (let i = order.length - 1; i > 0; i--) {
      state = (state * 48271) % 2147483647;
      const j = state % (i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }
}
