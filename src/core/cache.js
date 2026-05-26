const cache = new Map()
const TTL = 5 * 60 * 1000

export function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > TTL) {
    cache.delete(key)
    return null
  }
  return entry.data
}

export function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

export function invalidateCache(key) {
  if (key) cache.delete(key)
  else cache.clear()
}
