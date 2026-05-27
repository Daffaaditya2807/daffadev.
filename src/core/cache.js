const cache = new Map()
const TTL = 5 * 60 * 1000
const STORAGE_PREFIX = 'daffadev-cache:'

const getStorageKey = (key) => `${STORAGE_PREFIX}${key}`

const getLocalStorage = () => {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

const isExpired = (entry) => Date.now() - entry.timestamp > TTL

export function getCached(key) {
  const entry = cache.get(key)
  if (entry) {
    if (!isExpired(entry)) return entry.data

    cache.delete(key)
    getLocalStorage()?.removeItem(getStorageKey(key))
  }

  const stored = getLocalStorage()?.getItem(getStorageKey(key))
  if (!stored) return null

  try {
    const parsed = JSON.parse(stored)
    if (isExpired(parsed)) {
      getLocalStorage()?.removeItem(getStorageKey(key))
      return null
    }

    cache.set(key, parsed)
    return parsed.data
  } catch {
    getLocalStorage()?.removeItem(getStorageKey(key))
    return null
  }
}

export function setCache(key, data) {
  const entry = { data, timestamp: Date.now() }

  cache.set(key, entry)

  try {
    getLocalStorage()?.setItem(getStorageKey(key), JSON.stringify(entry))
  } catch {
    // localStorage can fail in private mode or when quota is full.
  }
}

export function invalidateCache(key) {
  const storage = getLocalStorage()

  if (key) {
    cache.delete(key)
    storage?.removeItem(getStorageKey(key))
    return
  }

  cache.clear()

  if (!storage) return

  Object.keys(storage)
    .filter((storageKey) => storageKey.startsWith(STORAGE_PREFIX))
    .forEach((storageKey) => storage.removeItem(storageKey))
}

export function invalidateCacheByPrefix(prefix) {
  const storage = getLocalStorage()

  Array.from(cache.keys())
    .filter((key) => key.startsWith(prefix))
    .forEach((key) => cache.delete(key))

  if (!storage) return

  Object.keys(storage)
    .filter((storageKey) => storageKey.startsWith(getStorageKey(prefix)))
    .forEach((storageKey) => storage.removeItem(storageKey))
}
