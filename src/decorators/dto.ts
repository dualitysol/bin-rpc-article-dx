/**
 * Re-export @layra/rpc decorators for article-dx.
 *
 * In production, you'd just import directly from '@layra/rpc':
 *
 *   import { Dto, Field } from '@layra/rpc';
 *
 * This re-export file exists so article readers can see a single
 * import source without navigating package internals.
 */

export {
  Dto,
  Field,
  getDtoFields,
  getDtoMetadata,
} from '@layra/rpc';

export type {
  FieldType,
  FieldDef,
  DtoMetadata,
} from '@layra/rpc';
