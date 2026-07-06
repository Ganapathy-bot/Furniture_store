import { Category } from '../src/models/Category';
import { User } from '../src/models/User';
import { Wishlist } from '../src/models/Wishlist';

type SchemaIndex = [Record<string, unknown>, Record<string, unknown>];

function indexSignature([fields, options]: SchemaIndex): string {
  return JSON.stringify({
    fields,
    unique: Boolean(options.unique),
  });
}

function duplicateIndexSignatures(indexes: SchemaIndex[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const index of indexes) {
    const signature = indexSignature(index);
    if (seen.has(signature)) {
      duplicates.add(signature);
    }
    seen.add(signature);
  }

  return [...duplicates];
}

describe('model indexes', () => {
  it('does not define duplicate indexes on any model', () => {
    const models = [Category, User, Wishlist];

    for (const model of models) {
      expect(duplicateIndexSignatures(model.schema.indexes())).toEqual([]);
    }
  });
});
