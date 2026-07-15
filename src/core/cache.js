export function getCached(key) {
  try { return JSON.parse(localStorage.getItem(`daffadev-${key}`)) } catch { return null }
}
export function setCache(key, data) {
  try { localStorage.setItem(`daffadev-${key}`, JSON.stringify(data)) } catch {return null}
}
export function invalidateCache(key) {
  if (key) localStorage.removeItem(`daffadev-${key}`)
  else localStorage.clear()
}
export function invalidateCacheByPrefix(prefix) {
  Object.keys(localStorage).filter(k => k.startsWith(`daffadev-${prefix}`)).forEach(k => localStorage.removeItem(k))
}
