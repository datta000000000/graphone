/**
 * Encodes an object or primitive into a base64 cursor string.
 */
export function encodeCursor(data: Record<string, any> | string | number): string {
  const jsonStr = typeof data === 'object' ? JSON.stringify(data) : String(data);
  return Buffer.from(jsonStr).toString('base64');
}

/**
 * Decodes a base64 cursor string back to its original value.
 */
export function decodeCursor<T = any>(cursor: string): T | null {
  try {
    const jsonStr = Buffer.from(cursor, 'base64').toString('utf-8');
    try {
      return JSON.parse(jsonStr) as T;
    } catch {
      return jsonStr as unknown as T;
    }
  } catch {
    return null;
  }
}

interface CursorData {
  lastValue: any;
  lastId: string;
}

/**
 * Decodes and validates a cursor for list pagination.
 */
export function parseCursor(cursorStr?: string): CursorData | null {
  if (!cursorStr) return null;
  const decoded = decodeCursor<CursorData>(cursorStr);
  if (decoded && typeof decoded === 'object' && 'lastId' in decoded) {
    return decoded;
  }
  return null;
}
