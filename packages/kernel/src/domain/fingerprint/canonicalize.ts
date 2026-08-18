/**
 * Deterministic JSON canonicalization.
 * Sorts object keys recursively and formats numbers/arrays consistently.
 */
export function canonicalizeJson(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    const items = obj.map(item => canonicalizeJson(item));
    return `[${items.join(',')}]`;
  }

  const record = obj as Record<string, unknown>;
  const sortedKeys = Object.keys(record).sort();
  const pairs = sortedKeys.map(key => {
    const val = record[key];
    if (val === undefined) {
      return null;
    }
    return `${JSON.stringify(key)}:${canonicalizeJson(val)}`;
  }).filter((p): p is string => p !== null);

  return `{${pairs.join(',')}}`;
}
