import { createContext, useCallback, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

const ToastCtx = createContext(/** @type {null | ((msg: string) => void)} */ (null))

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(/** @type {null | string} */ (null))

  const show = useCallback((msg) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2800)
  }, [])

  return (
    <ToastCtx.Provider value={show}>
      {children}
      {typeof document !== 'undefined' &&
        toast &&
        createPortal(
          <div
            className={cn(
              'fixed bottom-6 left-1/2 z-[300] max-w-sm -translate-x-1/2 rounded-lg border border-border bg-card px-4 py-3 text-center text-sm font-medium text-foreground shadow-lg',
            )}
            role="status"
          >
            {toast}
          </div>,
          document.body,
        )}
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) return () => {}
  return ctx
}
