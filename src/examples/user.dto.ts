/**
 * ─────────────────────────────────────────────────────────────
 *  🎯 USER DTOs — What the developer writes
 *
 *  No manual offset calculations. No Buffer.readUInt8 calls.
 *  Just declare fields with @Field() and let the code generator
 *  produce the optimised binary view.
 *
 *  See `generated/user.dto.ts` for the auto-generated code.
 * ─────────────────────────────────────────────────────────────
 */

import { Dto, Field } from '../decorators/dto.js';

// ── Request DTO ──────────────────────────────────────────────

@Dto()
export class CreateUserDto {
  @Field('string', 32)
  firstName!: string;

  @Field('string', 32)
  lastName!: string;

  @Field('number')
  age!: number;

  @Field('string', 32)
  email!: string;

  @Field('string', 1)
  sex!: string;

  @Field('string', 32)
  password!: string;

  @Field('boolean')
  active!: boolean;
}

// ── Response DTO ─────────────────────────────────────────────

@Dto()
export class UserCreatedDto {
  @Field('boolean')
  success!: boolean;

  @Field('string', 128)
  message!: string;
}
