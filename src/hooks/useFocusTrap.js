import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * @param {boolean} active
 */
export function useFocusTrap(active) {
  const ref = useRef(/** @type {HTMLElement | null} */ (null))

  useEffect(() => {
    if (!active || !ref.current) return
    const el = ref.current
    const focusables = el.querySelectorAll(FOCUSABLE)
    const list = Array.from(focusables).filter(
      (n) => !n.hasAttribute('disabled') && n.offsetParent !== null,
    )
    const first = list[0]
    const last = list[list.length - 1]
    /** @type {HTMLElement | undefined} */
    const f = first
    f?.focus()

    const onKey = (e) => {
      if (e.key !== 'Tab') return
      if (list.length === 0) return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        f?.focus()
      }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [active])

  return ref
}
