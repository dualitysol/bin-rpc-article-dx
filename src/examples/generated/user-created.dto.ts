// ═══════════════════════════════════════════════════════════════
//  Auto-generated binary view for @Dto(UserCreatedDto)
//  Layout: success: boolean, message: string[128]
//  Total size: 130 bytes
// ═══════════════════════════════════════════════════════════════

import { Buffer } from 'node:buffer';

// ── View Interface ──────────────────────────────────
export interface UserCreatedDtoView {
  readonly success: boolean;
  readonly message: string;
}

// ── Layout Constants ───────────────────────────────
export const SIZE = 130;
export const OFF_SUCCESS = 0;
export const OFF_MESSAGE = 1;

// ── Fast Monomorphic Readers & Writers ────────────
export function readSuccess(buf: Buffer): boolean {
  return buf.readUInt8(OFF_SUCCESS) !== 0;
}
export function writeSuccess(buf: Buffer, value: boolean): void {
  buf.writeUInt8(value ? 1 : 0, OFF_SUCCESS);
}

export function readMessage(buf: Buffer): string {
  const len = buf.readUInt8(OFF_MESSAGE);
  return buf.toString('utf8', OFF_MESSAGE + 1, OFF_MESSAGE + 1 + len);
}
export function writeMessage(buf: Buffer, value: string): void {
  const len = Buffer.byteLength(value, 'utf8');
  if (len > 128) throw new RangeError(`message too long (${len} > 128)`);
  buf.writeUInt8(len, OFF_MESSAGE);
  buf.fill(0, OFF_MESSAGE + 1, OFF_MESSAGE + 1 + 128);
  buf.write(value, OFF_MESSAGE + 1, len, 'utf8');
}

// ── Shared Prototype (zero alloc per DTO) ────────
const proto: Record<string, PropertyDescriptor> = Object.create(null);
Object.defineProperty(proto, 'success', {
  get() { return readSuccess(this._buf); },
  set(v) { writeSuccess(this._buf, v); },
  enumerable: true,
  configurable: false,
});
Object.defineProperty(proto, 'message', {
  get() { return readMessage(this._buf); },
  set(v) { writeMessage(this._buf, v); },
  enumerable: true,
  configurable: false,
});

// ── Factory ────────────────────────────────────────
export function createDTO(buf: Buffer): UserCreatedDtoView {
  return Object.create(proto, {
    _buf: {
      value: buf,
      writable: false,
      enumerable: false,
      configurable: false,
    },
  }) as unknown as UserCreatedDtoView;
}

export function writeToBuffer(
  buf: Buffer,
  success: boolean, message: string
): Buffer {
  writeSuccess(buf, success);
  writeMessage(buf, message);
  return buf;
}

// ── Utility ────────────────────────────────────────
export function toObject(buf: Buffer): UserCreatedDtoView {
  return {
    success: readSuccess(buf),
    message: readMessage(buf),
  } as UserCreatedDtoView;
}
