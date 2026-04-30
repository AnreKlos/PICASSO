import { defaultConfig } from '../src/configs/_default.config.js'
import { MASTER_DEFAULTS } from '../src/templates/beauty-master/master.defaults.js'

const templateCache = new Map()

/**
 * Template resolver - returns template configuration
 * Future: may support multiple templates (beauty-master, etc.)
 */
export function getTemplateConfig(templateSlug = 'beauty-master') {
  if (templateCache.has(templateSlug)) {
    return templateCache.get(templateSlug)
  }

  // Currently only beauty-master template exists
  const config = MASTER_DEFAULTS
  templateCache.set(templateSlug, config)
  return config
}

export function clearTemplateCache() {
  templateCache.clear()
}

export default { getTemplateConfig }
