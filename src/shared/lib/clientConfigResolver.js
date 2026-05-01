const clientConfigModules = import.meta.glob('../../../data/clients/*.json', { eager: true })

export function getClientConfig(slug) {
  if (!slug) return null

  const cacheKey = String(slug).trim().toLowerCase()
  const key = `../../../data/clients/${cacheKey}.json`
  const module = clientConfigModules[key]

  if (!module) return null

  return module.default || null
}
