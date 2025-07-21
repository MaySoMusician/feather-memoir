export function objectToLogString<T extends Record<string, unknown>>(obj: T): string {
  return Object.entries(obj)
    .map(([key, value]) => `${key} = ${value}`)
    .join(', ')
}
