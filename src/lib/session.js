const SESSION_ID_KEY = 'salon_session_id'
const SESSION_STARTED_KEY = 'salon_session_started'
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000

function createSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `sid_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function getOrCreateSessionId() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return createSessionId()
  }

  try {
    const now = Date.now()
    const savedId = localStorage.getItem(SESSION_ID_KEY)
    const savedStartedRaw = localStorage.getItem(SESSION_STARTED_KEY)
    const savedStarted = Number(savedStartedRaw)

    if (savedId && Number.isFinite(savedStarted) && now - savedStarted < SESSION_TTL_MS) {
      return savedId
    }

    const nextId = createSessionId()
    localStorage.setItem(SESSION_ID_KEY, nextId)
    localStorage.setItem(SESSION_STARTED_KEY, String(now))
    return nextId
  } catch {
    return createSessionId()
  }
}
