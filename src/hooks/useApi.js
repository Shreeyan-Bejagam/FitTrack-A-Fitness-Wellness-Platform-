import { useCallback, useEffect, useState } from 'react'

/**
 * @template T
 * @param {(...args: unknown[]) => Promise<{ data: { data: T } }>} apiFn
 * @param {{ immediate?: boolean, args?: unknown[] }} [options]
 */
export function useApi(apiFn, options = {}) {
  const { immediate = false, args = [] } = options
  const [data, setData] = useState(/** @type {T | null} */ (null))
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(/** @type {{ message: string, errors?: unknown } | null} */ (null))

  const execute = useCallback(
    async (...runArgs) => {
      setLoading(true)
      setError(null)
      try {
        const response = await apiFn(...(runArgs.length ? runArgs : args))
        const payload = response?.data?.data ?? response?.data
        setData(payload)
        return payload
      } catch (e) {
        setError(e)
        throw e
      } finally {
        setLoading(false)
      }
    },
    [apiFn, args],
  )

  useEffect(() => {
    if (!immediate) return
    void execute(...args)
  }, [immediate, apiFn])

  return { data, loading, error, execute }
}
