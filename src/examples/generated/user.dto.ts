// ═══════════════════════════════════════════════════════════════
//  Auto-generated binary view for @Dto(CreateUserDto)
//  Layout: firstName: string[32], lastName: string[32], age: number, email: string[32], sex: string[1], password: string[32], active: boolean
//  Total size: 167 bytes
// ═══════════════════════════════════════════════════════════════

import { Buffer } from 'node:buffer';

// ── View Interface ──────────────────────────────────
export interface CreateUserDtoView {
  readonly firstName: string;
  readonly lastName: string;
  readonly age: number;
  readonly email: string;
  readonly sex: string;
  readonly password: string;
  readonly active: boolean;
}

// ── Layout Constants ───────────────────────────────
export const SIZE = 167;
export const OFF_FIRSTNAME = 0;
export const OFF_LASTNAME = 33;
export const OFF_AGE = 66;
export const OFF_EMAIL = 67;
export const OFF_SEX = 100;
export const OFF_PASSWORD = 133;
export const OFF_ACTIVE = 166;

// ── Fast Monomorphic Readers & Writers ────────────
export function readFirstName(buf: Buffer): string {
  const len = buf.readUInt8(OFF_FIRSTNAME);
  return buf.toString('utf8', OFF_FIRSTNAME + 1, OFF_FIRSTNAME + 1 + len);
}
export function writeFirstName(buf: Buffer, value: string): void {
  const len = Buffer.byteLength(value, 'utf8');
  if (len > 32) throw new RangeError(`firstName too long (${len} > 32)`);
  buf.writeUInt8(len, OFF_FIRSTNAME);
  buf.fill(0, OFF_FIRSTNAME + 1, OFF_FIRSTNAME + 1 + 32);
  buf.write(value, OFF_FIRSTNAME + 1, len, 'utf8');
}

export function readLastName(buf: Buffer): string {
  const len = buf.readUInt8(OFF_LASTNAME);
  return buf.toString('utf8', OFF_LASTNAME + 1, OFF_LASTNAME + 1 + len);
}
export function writeLastName(buf: Buffer, value: string): void {
  const len = Buffer.byteLength(value, 'utf8');
  if (len > 32) throw new RangeError(`lastName too long (${len} > 32)`);
  buf.writeUInt8(len, OFF_LASTNAME);
  buf.fill(0, OFF_LASTNAME + 1, OFF_LASTNAME + 1 + 32);
  buf.write(value, OFF_LASTNAME + 1, len, 'utf8');
}

export function readAge(buf: Buffer): number {
  return buf.readUInt8(OFF_AGE);
}
export function writeAge(buf: Buffer, value: number): void {
  buf.writeUInt8(value, OFF_AGE);
}

export function readEmail(buf: Buffer): string {
  const len = buf.readUInt8(OFF_EMAIL);
  return buf.toString('utf8', OFF_EMAIL + 1, OFF_EMAIL + 1 + len);
}
export function writeEmail(buf: Buffer, value: string): void {
  const len = Buffer.byteLength(value, 'utf8');
  if (len > 32) throw new RangeError(`email too long (${len} > 32)`);
  buf.writeUInt8(len, OFF_EMAIL);
  buf.fill(0, OFF_EMAIL + 1, OFF_EMAIL + 1 + 32);
  buf.write(value, OFF_EMAIL + 1, len, 'utf8');
}

export function readSex(buf: Buffer): string {
  const len = buf.readUInt8(OFF_SEX);
  return buf.toString('utf8', OFF_SEX + 1, OFF_SEX + 1 + len);
}
export function writeSex(buf: Buffer, value: string): void {
  const len = Buffer.byteLength(value, 'utf8');
  if (len > 1) throw new RangeError(`sex too long (${len} > 1)`);
  buf.writeUInt8(len, OFF_SEX);
  buf.fill(0, OFF_SEX + 1, OFF_SEX + 1 + 1);
  buf.write(value, OFF_SEX + 1, len, 'utf8');
}

export function readPassword(buf: Buffer): string {
  const len = buf.readUInt8(OFF_PASSWORD);
  return buf.toString('utf8', OFF_PASSWORD + 1, OFF_PASSWORD + 1 + len);
}
export function writePassword(buf: Buffer, value: string): void {
  const len = Buffer.byteLength(value, 'utf8');
  if (len > 32) throw new RangeError(`password too long (${len} > 32)`);
  buf.writeUInt8(len, OFF_PASSWORD);
  buf.fill(0, OFF_PASSWORD + 1, OFF_PASSWORD + 1 + 32);
  buf.write(value, OFF_PASSWORD + 1, len, 'utf8');
}

export function readActive(buf: Buffer): boolean {
  return buf.readUInt8(OFF_ACTIVE) !== 0;
}
export function writeActive(buf: Buffer, value: boolean): void {
  buf.writeUInt8(value ? 1 : 0, OFF_ACTIVE);
}

// ── Shared Prototype (zero alloc per DTO) ────────
const proto: Record<string, PropertyDescriptor> = Object.create(null);
Object.defineProperty(proto, 'firstName', {
  get() { return readFirstName(this._buf); },
  set(v) { writeFirstName(this._buf, v); },
  enumerable: true,
  configurable: false,
});
Object.defineProperty(proto, 'lastName', {
  get() { return readLastName(this._buf); },
  set(v) { writeLastName(this._buf, v); },
  enumerable: true,
  configurable: false,
});
Object.defineProperty(proto, 'age', {
  get() { return readAge(this._buf); },
  set(v) { writeAge(this._buf, v); },
  enumerable: true,
  configurable: false,
});
Object.defineProperty(proto, 'email', {
  get() { return readEmail(this._buf); },
  set(v) { writeEmail(this._buf, v); },
  enumerable: true,
  configurable: false,
});
Object.defineProperty(proto, 'sex', {
  get() { return readSex(this._buf); },
  set(v) { writeSex(this._buf, v); },
  enumerable: true,
  configurable: false,
});
Object.defineProperty(proto, 'password', {
  get() { return readPassword(this._buf); },
  set(v) { writePassword(this._buf, v); },
  enumerable: true,
  configurable: false,
});
Object.defineProperty(proto, 'active', {
  get() { return readActive(this._buf); },
  set(v) { writeActive(this._buf, v); },
  enumerable: true,
  configurable: false,
});

// ── Factory ────────────────────────────────────────
export function createDTO(buf: Buffer): CreateUserDtoView {
  return Object.create(proto, {
    _buf: {
      value: buf,
      writable: false,
      enumerable: false,
      configurable: false,
    },
  }) as unknown as CreateUserDtoView;
}

export function writeToBuffer(
  buf: Buffer,
  firstName: string, lastName: string, age: number, email: string, sex: string, password: string, active: boolean
): Buffer {
  writeFirstName(buf, firstName);
  writeLastName(buf, lastName);
  writeAge(buf, age);
  writeEmail(buf, email);
  writeSex(buf, sex);
  writePassword(buf, password);
  writeActive(buf, active);
  return buf;
}

// ── Utility ────────────────────────────────────────
export function toObject(buf: Buffer): CreateUserDtoView {
  return {
    firstName: readFirstName(buf),
    lastName: readLastName(buf),
    age: readAge(buf),
    email: readEmail(buf),
    sex: readSex(buf),
    password: readPassword(buf),
    active: readActive(buf),
  } as CreateUserDtoView;
}
