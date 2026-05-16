import { useCallback, useEffect, useState } from 'react'

export const STEP_KEYS = [
  'account',
  'personal',
  'goals',
  'activity',
  'profile',
]

/**
 * @typedef {Record<string, unknown>} FormShape
 */
export function useMultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(/** @type {FormShape} */ ({}))
  const [canProceed, setCanProceed] = useState(false)

  useEffect(() => {
    setCanProceed(false)
  }, [currentStep])

  const setStepData = useCallback((stepKey, data) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: {
        ...(prev[stepKey] && typeof prev[stepKey] === 'object' ? prev[stepKey] : {}),
        ...data,
      },
    }))
  }, [])

  const goNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, 5))
  }, [])

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1))
  }, [])

  return {
    currentStep,
    formData,
    setStepData,
    goNext,
    goBack,
    setCurrentStep,
    canProceed,
    setCanProceed,
  }
}
