import { useEffect, useRef, useState } from 'react'

export const useResizeWindow = (innerWidth = 575) => {
  const [isLessThan, setIsLessThan] = useState(window.innerWidth <= innerWidth)

  useEffect(() => {
    const windowResizeListener = window.addEventListener('resize', () => {
      setIsLessThan(window.innerWidth <= innerWidth)
    })

    return () => window.removeEventListener('resize', windowResizeListener as any)
  }, [innerWidth])

  return [isLessThan]
}

export const useOnClickOutside = (ref: any, handler: any, exceptionRef?: any) => {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target) || exceptionRef?.current?.contains(event.target)) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
    }
  }, [ref, handler, exceptionRef])
}
