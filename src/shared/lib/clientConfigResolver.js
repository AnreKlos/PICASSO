const clientConfigModules = import.meta.glob('../../configs/*.config.js', { eager: true })

export function getClientConfig(slug) {
  if (!slug) return null

  const cacheKey = String(slug).trim().toLowerCase()
  const key = `../../configs/${cacheKey}.config.js`

  console.log('slug=', slug)
  console.log('available config keys=', Object.keys(clientConfigModules))
  console.log('lookup key=', key)

  const module = clientConfigModules[key]

  console.log('resolved module=', module)

  if (!module) return null

  return module.default || null
}
