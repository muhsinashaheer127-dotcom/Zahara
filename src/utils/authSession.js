/** Set while the user is intentionally signing out (avoids redirect loops / 401 handler fights). */
export const INTENTIONAL_LOGOUT_KEY = 'zh_intentional_logout'

export const beginIntentionalLogout = () => {
  try {
    sessionStorage.setItem(INTENTIONAL_LOGOUT_KEY, '1')
  } catch {
    /* ignore */
  }
}

export const isIntentionalLogout = () => {
  try {
    return sessionStorage.getItem(INTENTIONAL_LOGOUT_KEY) === '1'
  } catch {
    return false
  }
}

export const endIntentionalLogout = () => {
  try {
    sessionStorage.removeItem(INTENTIONAL_LOGOUT_KEY)
  } catch {
    /* ignore */
  }
}
