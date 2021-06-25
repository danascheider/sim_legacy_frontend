import { useState, useRef, useEffect } from 'react'

const useComponentVisible = () => {
  const [isComponentVisible, setIsComponentVisible] = useState(false)
  const componentRef = useRef(null)
  const triggerRef = useRef(null)

  const componentRefContains = element => componentRef.current && componentRef.current.contains(element)
  const triggerRefContains = element => triggerRef.current && triggerRef.current.contains(element)

  const handleHideDiv = e => {
    if (e.key === 'Escape') {
      setIsComponentVisible(false)
    }
  }

  const handleClickOutside = e => {
    if (!componentRefContains(e.target) && !triggerRefContains(e.target)) {
      setIsComponentVisible(false)
    } else if (triggerRefContains(e.target)) {
      setIsComponentVisible(!isComponentVisible)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleHideDiv, true)
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('keydown', handleHideDiv, true)
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  return { componentRef, triggerRef, isComponentVisible, setIsComponentVisible }
}

export default useComponentVisible
